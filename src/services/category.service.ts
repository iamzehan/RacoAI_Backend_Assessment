import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository
  ) {}

  /**
   * Create a category.
   */
  create = async (data: CreateCategoryDto) => {
    const category = await this.categoryRepo.create(data);

    if (!category) {
      throw new Error("Failed to create category.");
    }

    return category;
  };

  /**
   * Retrieve all categories.
   */
  read = async () => {
    const categories = await this.categoryRepo.findAll();

    if (categories.length === 0) {
      throw new Error("No categories found.");
    }

    return categories;
  };

  /**
   * Retrieve a single category.
   */
  readOne = async (id: string) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  };

  /**
   * Update a category.
   */
  update = async (data: UpdateCategoryDto) => {
    if (!data.id) {
      throw new Error("Category ID is required.");
    }

    const category = await this.categoryRepo.update(data);

    if (!category) {
      throw new Error("Failed to update category.");
    }

    return category;
  };

  /**
   * Delete a category.
   */
  delete = async (id: string) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const category = await this.categoryRepo.delete(id);

    if (!category) {
      throw new Error("Failed to delete category.");
    }

    return true;
  };

  /**
   * Returns the cached category tree.
   * (Redis implementation will be added later.)
   */
  getTree = async () => {
    throw new Error("Not implemented.");
  };

  /**
   * Returns all descendant category IDs using DFS.
   * (Implemented after Redis/tree builder.)
   */
  getDescendantIds = async (categoryId: string) => {
    throw new Error("Not implemented.");
  };
}