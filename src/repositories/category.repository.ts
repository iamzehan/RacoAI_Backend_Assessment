import { prisma } from "../config/prisma.js";
export class CategoryRepository {
  constructor() {}

  /**
   * Create a category.
   */
  create = async (data: CreateCategoryDto) => {
    return prisma.categories.create({
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId ?? null,
      },
    });
  };

  /**
   * Retrieve all categories.
   */
  findAll = async () => {
    return prisma.categories.findMany({
      orderBy: {
        name: "asc",
      },
    });
  };

  /**
   * Retrieve a single category.
   */
  findById = async (id: string) => {
    return prisma.categories.findUnique({
      where: {
        id,
      },
    });
  };

  /**
   * Update a category.
   */
  update = async (data: UpdateCategoryDto) => {
    return prisma.categories.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId,
      },
    });
  };

  /**
   * Delete a category.
   */
  delete = async (id: string) => {
    return prisma.categories.delete({
      where: {
        id,
      },
    });
  };
}