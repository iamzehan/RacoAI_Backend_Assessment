import { Prisma } from "../generated/prisma/client.js";
import { OrderStatus, ProductStatus } from "../generated/prisma/enums.js";

import { OrderRepository } from "../repositories/order.repository.js";
import RedisService from "./redis.service.js";

import { CreateOrderData, OrderQuery } from "../types/order.d.js";
import { CacheKey } from "../utils/cache-key.js";
import { CacheTTL } from "../utils/constants.js";
import { prisma } from "../config/prisma.js";
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly redis: RedisService
  ) {}

  private generateOrderNumber() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    return `ORD-${date}-${random}`;
  }

  create = async (data: CreateOrderData) => {
    if (!data.userId) {
      throw new Error("User ID is required.");
    }

    if (data.items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    // start transaction to create order
    return this.orderRepo.transaction(async (tx) => {
      // at first we get the product ids of the items ordered in a list
      const productIds = data.items.map((item) => item.productId);

      // then we find those products in the order list that are in stock
      const products = await this.orderRepo.findProducts(productIds, tx);

      // if retrieved products are missing we say they are missing
      if (products.length !== data.items.length) {
        throw new Error("One or more products do not exist.");
      }

      // Mapping the products with their ids for easier lookup
      const productMap = new Map(products.map((p) => [p.id, p]));

      // orderItems list initializer
      const orderItems: Prisma.OrderItemCreateManyInput[] = [];
      // subtotal Initializer
      let subtotal = new Prisma.Decimal(0);

      // iterate through the items in the order data
      for (const item of data.items) {
        const product = productMap.get(item.productId)!;

        // if product status is not active then it's unavailable
        if (product.status !== ProductStatus.ACTIVE) {
          throw new Error(`${product.name} is unavailable.`);
        }
        // if it's not in the stock for the selected quantity then it's done
        if (!product.stock || product.stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }

        // calculate item subtotal
        const itemSubtotal = product.price.mul(item.quantity);

        // add it to the external subtotal
        subtotal = subtotal.add(itemSubtotal);

        // push it to the orderItems list
        orderItems.push({
          orderId: "", // assigned after order creation
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          productName: product.name,
          sku: product.sku,
          subtotal: itemSubtotal
        });
      }

      /*
       Now create this order along with a 
       newly generated order number & user id 
      */

      const order = await this.orderRepo.create(
        {
          orderNumber: this.generateOrderNumber(),
          user: {
            connect: {
              id: data.userId
            }
          },
          subtotal,
          discount: new Prisma.Decimal(0),
          shipping: new Prisma.Decimal(0),
          total: subtotal
        },
        tx
      );

      /*
       * Now use the order id in the orderItems to place entry into OrderItems table
       */
      orderItems.forEach((item) => {
        item.orderId = order.id;
      });

      await this.orderRepo.createOrderItems(orderItems, tx);

      for (const item of data.items) {
        await this.orderRepo.decreaseStock(item.productId, item.quantity, tx);
      }

      return this.orderRepo.findById(order.id);
    });
  };

  // read orders
  read = async (query: OrderQuery) => {
    const key = CacheKey.orders(query);

    const cached = await this.redis.get(key);
    if (cached) return cached;

    const orders = await this.orderRepo.findAll(query);

    if (orders.data.length === 0) {
      throw new Error("No orders found.");
    }

    await this.redis.set(key, orders, CacheTTL.ORDERS);

    return orders;
  };

  // read one order by id
  private readOneById = async (id: string) => {
    const key = CacheKey.order(id);

    const cached = await this.redis.get(key);
    if (cached) return cached;

    const order = await this.orderRepo.findById(id);

    if (!order) {
      throw new Error("No orders found.");
    }

    await this.redis.set(key, order, CacheTTL.ORDERS);

    return order;
  };

  // read by order number

  private readOneByOrderNumber = async (orderNumber: string) => {
    const key = CacheKey.orderNum(orderNumber);

    const cached = await this.redis.get(key);
    if (cached) return cached;

    const order = await this.orderRepo.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error(`Order ${orderNumber} not found!`);
    }

    await this.redis.set(key, order, CacheTTL.ORDERS);

    return order;
  };

  // alternate between id and order number to read one order
  readOne = async (query: { id?: string; orderNumber?: string }) => {
    const { id, orderNumber } = query;
    try {
      if (id) {
        return await this.readOneById(id);
      }
      if (orderNumber) {
        return await this.readOneByOrderNumber(orderNumber);
      }
    } catch (error) {
      return error;
    }
  };

  // read current user's orders
  readUserOrders = async (userId: string, page = 1, limit = 10) => {
    const orders = await this.orderRepo.findUserOrders(
      userId,
      (page - 1) * limit,
      limit
    );

    return orders;
  };

  // update order status
  updateStatus = async (id: string, status: OrderStatus) => {
    const order = await this.orderRepo.findById(id);

    if (!order) {
      throw new Error("Order not found.");
    }

    const updated = await this.orderRepo.updateStatus(id, status);

    await this.redis.delete(CacheKey.order(id));

    return updated;
  };

  /*
   * Cancel an order
   */

  cancel = async (id: string) => {
    return this.orderRepo.transaction(async (tx) => {
      const order = await this.orderRepo.findById(id);

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new Error("Only pending orders can be cancelled.");
      }

      for (const item of order.items) {
        await this.orderRepo.increaseStock(item.productId, item.quantity, tx);
      }

      await this.orderRepo.updateStatus(id, OrderStatus.CANCELLED, tx);

      await this.redis.delete(CacheKey.order(id));

      return this.orderRepo.findById(id);
    });
  };

  /*
   * Delete order
   */

  delete = async (id: string) => {
    const order = await this.orderRepo.findById(id);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status !== OrderStatus.CANCELLED) {
      throw new Error("Only cancelled orders can be deleted.");
    }

    await this.orderRepo.delete(id);

    await this.redis.delete(CacheKey.order(id));

    return true;
  };

  async completeOrder(orderId: string) {
    return prisma.$transaction(async (tx) => {
      // Get order with items
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true
        }
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.status === OrderStatus.PAID) {
        return order;
      }

      // Reduce stock
      for (const item of order.items) {
        const updated = await tx.stock.updateMany({
          where: {
            productId: item.productId,
            quantity: {
              gte: item.quantity
            }
          },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });

        if (updated.count === 0) {
          throw new Error(
            `Insufficient stock for product ${item.productName}.`
          );
        }
      }

      // Mark order as paid
      const completedOrder = await tx.order.update({
        where: {
          id: orderId
        },
        data: {
          status: OrderStatus.PAID
        }
      });

      return completedOrder;
    });
  }
}
