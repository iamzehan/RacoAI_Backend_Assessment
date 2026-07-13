import { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { ProductStatus, Role } from "../generated/prisma/client.js";
import { HttpStatus } from "../utils/constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pagination } from "../utils/helpers.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get products with optional pagination and status filter.
   */
  getProducts = async (req: Request, res: Response) => {
    try {
      let { categoryId, search, sort } = req.query;

      const userRole = req.userRole as Role;

      // Only admins can view all products.
      // Everyone else only sees ACTIVE products.
      const status =
        userRole === Role.ADMIN
          ? (req.query.status as ProductStatus | undefined)
          : ProductStatus.ACTIVE;

      // parse the pagination 
      const { page, limit } = Pagination.from(req.query);

      
      
      // get the products
      const products = await this.productService.read({
        page,
        limit,
        status,
        categoryId: categoryId as string | undefined,
        search: search as string | undefined,
        sort: sort as string | undefined
      });

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Retrieved products successfully.", products)
        );
    } catch (error) {
      console.error(error);

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to retrieve products."
          )
        );
    }
  };

  /**
   * Generate a unique SKU.
   */
  getSKU = async (req: Request, res: Response) => {
    try {
      const sku = await this.productService.createSKU();

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("SKU generated successfully.", { sku }));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Failed to generate SKU."
          )
        );
    }
  };

  /**
   * Create a new product.
   */
  createProducts = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.create(req.body);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("Product created successfully.", product));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Failed to create product."
          )
        );
    }
  };
  /**
   * Update a product.
   */
  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.update(req.body);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Product updated successfully.", product));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Failed to update product."
          )
        );
    }
  };

  /**
   * Delete a single product.
   */
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      const result = await this.productService.deleteOne(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Product deleted successfully.", result));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Failed to delete product."
          )
        );
    }
  };

  /**
   * Delete multiple products.
   */
  deleteProducts = async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;

      const result = await this.productService.deleteMany(ids);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Products deleted successfully.", result));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to delete products."
          )
        );
    }
  };

  // get product detail
  getDetails = async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
      const result = await this.productService.readOne(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Page not found"
          )
        );
    }
  };
}
