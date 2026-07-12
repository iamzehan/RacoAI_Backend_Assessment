import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpStatus } from "../utils/constants.js";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.read();

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Retrieved categories successfully.", categories)
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to retrieve categories."
          )
        );
    }
  };

  getCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      const category = await this.categoryService.readOne(id);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Retrieved category successfully.", category)
        );
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(
          ApiResponse.error(
            error instanceof Error ? error.message : "Category not found."
          )
        );
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.create(req.body);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("Category created successfully.", category));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to create category."
          )
        );
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.update(req.body);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Category updated successfully.", category));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to update category."
          )
        );
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id.toString();
      await this.categoryService.delete(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Category deleted successfully."));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to delete category."
          )
        );
    }
  };

  getTree = async (req: Request, res: Response) => {
    try {
      const tree = await this.categoryService.getTree();

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Retrieved category tree successfully.", tree)
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ApiResponse.error(
            error instanceof Error
              ? error.message
              : "Failed to retrieve category tree."
          )
        );
    }
  };
}
