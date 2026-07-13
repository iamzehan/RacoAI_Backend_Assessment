import { CategoryRepository } from "../repositories/category.repository.js";
import { CategoryNode, TreeBuilder } from "../utils/tree-builder.js";
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

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
   */
  getTree = async () => {
    const categories = await this.categoryRepo.findAll();

    if (categories.length === 0) {
      throw new Error("No categories found.");
    }

    return TreeBuilder.build(categories);
  };

  /**
   * Helps find a node from nodes 
   */
  private findNode(nodes: CategoryNode[], id: string): CategoryNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      const found = this.findNode(node.children, id);

      if (found) {
        return found;
      }
    }

    return null;
  }

  /*
    * DFS(Depth first search) tree traversal to find all related categories 
  */
  private dfs(node: CategoryNode, ids: Set<string>) {
    ids.add(node.id);

    for (const child of node.children) {
      this.dfs(child, ids);
    }
  }

  /**
   * Returns all descendant category IDs using DFS.
   */
  getDescendantIds = async (categoryId: string) => {
    const tree = await this.getTree();

    const node = this.findNode(tree, categoryId);

    if (!node) {
      throw new Error("Category not found.");
    }

    const ids: Set<string> = new Set<string>();

    this.dfs(node, ids);

    return [...ids];
  };
}
