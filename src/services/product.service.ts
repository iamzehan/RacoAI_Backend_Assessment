import { ProductRepository } from "../repositories/product.repository.js";
import { ProductData, ProductQuery } from "../types/product.js";

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

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
    const products = await this.productRepo.allProducts(query);

    if (products.data.length === 0) {
      throw new Error("No products found.");
    }

    return products;
  };

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
