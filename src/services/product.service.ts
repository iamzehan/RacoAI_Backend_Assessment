import { ProductRepository } from "../repositories/product.repository.js";
import { ProductData, ProductQuery } from "../types/product.js";
import { CacheKey } from "../utils/cache-key.js";
import { CacheTTL } from "../utils/constants.js";
import RedisService from "./redis.service.js";

export class ProductService {
  
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly redis: RedisService
  ) {}

  /**
   * Create a product.
   */
  create = async (data: ProductData) => {
    const product = await this.productRepo.createProduct(data);

    if (!product) {
      throw new Error("Failed to create product.");
    }

    return product;
  };

  /**
   * Get products with optional pagination and status filter.
   */
  read = async (query: ProductQuery = {}) => {
    // first check the cache
    const key = CacheKey.products(query);
    const cached = await this.redis.get(key);
    if(cached) {
      // return cache if found
      return cached;
    }
    // then go to the database for retrieval
    const products = await this.productRepo.findProducts(query);
    if (products.data.length === 0) {
      throw new Error("No products found.");
    }
    // now set the cache to redis via redis service
    await this.redis.set(key, products, CacheTTL.PRODUCTS);
    
    // return results
    return products;
  };

  /**
   * Get product details
   */
  async readOne(id: string) {
    // Determin what key to look with
    const key = CacheKey.product(id);

    // go through cache
    const cached = await this.redis.get(key);

    // return cache if found
    if (cached) return cached;

    // get product from database if cache doesn't contain
    const product = await this.productRepo.findOne(id);

    // throw error if not found
    if (!product) throw new Error("No details found!");

    // set the cache
    await this.redis.set(key, product, CacheTTL.PRODUCT);

    return product;
  }

  /**
   * Update a product.
   */
  update = async (data: ProductData) => {
    if (!data.id) {
      throw new Error("Product ID is required.");
    }

    const product = await this.productRepo.udpateProduct(data);

    if (!product) {
      throw new Error("Failed to update product.");
    }

    return product;
  };

  /**
   * Delete a single product.
   */
  deleteOne = async (id: string) => {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    const product = await this.productRepo.deleteProduct(id);

    if (!product) {
      throw new Error("Failed to delete product.");
    }

    return true;
  };

  /**
   * Delete multiple products.
   */
  deleteMany = async (ids: string[]) => {
    if (ids.length === 0) {
      throw new Error("At least one product ID is required.");
    }

    const result = await this.productRepo.deleteMultipleProduct(ids);

    if (result.count === 0) {
      throw new Error("No products were deleted.");
    }

    return {
      deleted: result.count
    };
  };

  /**
   * Generate a unique product SKU.
   */
  createSKU = async () => {
    const sku = await this.productRepo.generateUniqueSKU();

    if (!sku) {
      throw new Error("Failed to generate product SKU.");
    }

    return sku;
  };
}
