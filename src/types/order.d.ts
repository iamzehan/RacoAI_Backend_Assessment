import { OrderStatus } from "../generated/prisma/enums.js";
interface CreateOrderDto {
    items: {
        productId: string;
        quantity: number;
    }[];

    shipping?: number;
    discount?: number;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface OrderDto {
  id?: string;

  userId: string;

  items: OrderItemData[];

  shipping?: number;

  discount?: number;

  status?: OrderStatus;
}

export interface OrderQuery {
  page?: number;

  limit?: number;

  status?: OrderStatus;

  userId?: string;

  search?: string;

  sort?: string;
}

export interface OrderCalculation {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderProductSnapshot {
  id: string;

  sku: string;

  name: string;

  price: number;

  quantity: number;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}


export interface CreateOrderData {
  userId: string;
  items: CreateOrderItem[];
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  sort? : string;
}