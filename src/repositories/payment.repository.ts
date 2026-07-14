import { prisma } from "../config/prisma.js";
import {
  Payment,
  PaymentProvider,
  PaymentStatus
} from "../generated/prisma/client.js";

export class PaymentRepository {
  /**
   * Create a payment record.
   */
  async create(data: {
    orderId: string;
    provider: PaymentProvider;
    amount: number;
  }) {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        amount: data.amount
      }
    });
  }

  /**
   * Find a payment by its ID.
   */
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id }
    });
  }

  /**
   * Find a payment by order ID.
   */
  async findByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: { orderId }
    });
  }

  /**
   * Find a payment by transaction ID.
   */
  async findByTransactionId(transactionId: string) {
    return prisma.payment.findUnique({
      where: { transactionId }
    });
  }

  /**
   * Update payment.
   */
  async update(id: string, data: Partial<Payment>) {
    return prisma.payment.update({
      where: { id },
      data
    });
  }

  /**
   * Update payment status.
   */
  async updateStatus(id: string, status: PaymentStatus) {
    return prisma.payment.update({
      where: { id },
      data: { status }
    });
  }

  /**
   * Save gateway transaction ID.
   */
  async updateTransactionId(id: string, transactionId: string) {
    return prisma.payment.update({
      where: { id },
      data: { transactionId }
    });
  }

  /**
   * Mark payment as paid.
   */
  async markPaid(id: string, transactionId: string) {
    return prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        transactionId,
        paidAt: new Date()
      }
    });
  }

  /**
   * Mark payment as failed.
   */
  async markFailed(id: string) {
    return prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.FAILED
      }
    });
  }

  /**
   * Mark payment as refunded.
   */
  async markRefunded(id: string) {
    return prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.REFUNDED
      }
    });
  }
}