import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { OrderStatus } from "../generated/prisma/enums.js";
import { OrderQuery } from "../types/order.js";
import { parsePrismaOrderBy } from "../utils/lib.js";

type PrismaTransaction = Prisma.TransactionClient;

export class OrderRepository {
  private getClient(tx?: PrismaTransaction) {
    return tx ?? prisma;
  }

  /**
   * Execute a transaction.
   */
  transaction = async <T>(callback: (tx: PrismaTransaction) => Promise<T>) => {
    return prisma.$transaction(callback);
  };

  /**
   * Create an order.
   */
  create = async (data: Prisma.OrderCreateInput, tx?: PrismaTransaction) => {
    return this.getClient(tx).order.create({
      data
    });
  };

  /**
   * Create multiple order items.
   */
  createOrderItems = async (
    data: Prisma.OrderItemCreateManyInput[],
    tx?: PrismaTransaction
  ) => {
    return this.getClient(tx).orderItem.createMany({
      data
    });
  };

  /**
   * Find products with stock.
   */
  findProducts = async (ids: string[], tx?: PrismaTransaction) => {
    return this.getClient(tx).product.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        stock: true
      }
    });
  };

  /**
   * Find an order by ID.
   */
  findById = async (id: string) => {
    return prisma.order.findUnique({
      where: {
        id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        payment: true
      }
    });
  };

  /**
   * Find an order by order number.
   */
  findByOrderNumber = async (orderNumber: string) => {
    return prisma.order.findUnique({
      where: {
        orderNumber
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payment: true
      }
    });
  };

  /**
   * Find all orders belonging to a user.
   */
  findUserOrders = async (userId: string, skip = 0, take = 10) => {
    return prisma.order.findMany({
      where: {
        userId
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        items: true,
        payment: true
      }
    });
  };

  /**
   * Find all orders.
   */
  findAll = async ({ page, limit, status, userId, sort }: OrderQuery = {}) => {
    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    const shouldPaginate =
      page !== undefined && limit !== undefined && page > 0 && limit > 0;

    const orderBy = sort
      ? parsePrismaOrderBy(sort)
      : parsePrismaOrderBy("createdAt:desc");

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          items: {
            include: {
              product: true
            }
          },
          payment: true
        },
        ...(shouldPaginate && {
          skip: (page - 1) * limit,
          take: limit
        })
      }),

      prisma.order.count({
        where
      })
    ]);

    return {
      data: orders,
      pagination: shouldPaginate
        ? {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1
          }
        : null
    };
  };
  /**
   * Update order status.
   */
  updateStatus = async (
    id: string,
    status: OrderStatus,
    tx?: PrismaTransaction
  ) => {
    return this.getClient(tx).order.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  };

  /**
   * Decrease product stock.
   */
  decreaseStock = async (
    productId: string,
    quantity: number,
    tx?: PrismaTransaction
  ) => {
    return this.getClient(tx).stock.update({
      where: {
        productId
      },
      data: {
        quantity: {
          decrement: quantity
        }
      }
    });
  };

  /**
   * Increase product stock.
   */
  increaseStock = async (
    productId: string,
    quantity: number,
    tx?: PrismaTransaction
  ) => {
    return this.getClient(tx).stock.update({
      where: {
        productId
      },
      data: {
        quantity: {
          increment: quantity
        }
      }
    });
  };

  /**
   * Delete an order.
   */
  delete = async (id: string, tx?: PrismaTransaction) => {
    return this.getClient(tx).order.delete({
      where: {
        id
      }
    });
  };
}
