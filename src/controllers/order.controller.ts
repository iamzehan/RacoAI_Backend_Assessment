import { Request, Response } from "express";
import { OrderStatus, Role } from "../generated/prisma/enums.js";

import {OrderRepository} from "../repositories/order.repository.js";
import RedisService from "../services/redis.service.js";
import { OrderService } from "../services/order.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpStatus } from "../utils/constants.js";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Create Order
   */
  createOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.create({
        userId: req.userId!,
        items: req.body.items
      });

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("Order created successfully.", order));
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get Orders
   * Admin -> All orders
   * User -> Own orders
   */
  getOrders = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;

      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const status = req.query.status as OrderStatus | undefined;

      const role = req.userRole as Role;

      const orders = await this.orderService.read({
        page,
        limit,
        status,
        userId: role === Role.USER ? req.userId : undefined
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Orders fetched successfully.", orders));
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get Single Order
   */
  getOrder = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as string | undefined;
      const orderNumber = req.query.order_number as string | undefined;

      if (!id && !orderNumber) {
        throw new Error("Either id or order_number is required.");
      }

      const order = await this.orderService.readOne({
        id,
        orderNumber
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Order fetched successfully.", order));
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update Order Status
   */
  updateStatus = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      const order = await this.orderService.updateStatus(id, req.body.status);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Order status updated successfully.", order));
    } catch (error) {
      throw error;
    }
  };

  /**
   * Cancel Order
   */
  cancelOrder = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      const order = await this.orderService.cancel(id);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Order cancelled successfully.", order)
        );
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete Order
   */
  deleteOrder = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      await this.orderService.delete(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Order deleted successfully."));
    } catch (error) {
      throw error;
    }
  };
}
