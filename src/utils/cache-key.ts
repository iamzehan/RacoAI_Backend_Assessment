import { OrderQuery } from "../types/order.js";
import { ProductQuery } from "../types/product.js";

export class CacheKey {

  // Cache key for product(s)

  static product(id: string) {
    return `product:${id}`;
  }
  
  static products(query: ProductQuery) {
    return `products:${JSON.stringify(query)}`;
  }

  // Cache key for order(s)
  static order(id: string) {
    return `order:${id}`;
  }
  static orderNum(orderNumber: string){
    return `orderNum: ${orderNumber}`
  }
  static orders(query: OrderQuery) {
    return `orders: ${JSON.stringify(query)}`;
  }
}