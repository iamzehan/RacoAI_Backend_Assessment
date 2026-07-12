import { ProductQuery } from "../types/product.js";

export class CacheKey {
  static product(id: string) {
    return `product:${id}`;
  }

  static products(query: ProductQuery) {
    return `products:${JSON.stringify(query)}`;
  }
}