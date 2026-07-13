import { prisma } from "../config/prisma.js";
export class CategoryRepository {
  constructor() {}

  /**
   * Create a category.
   */
  create = async (data: CreateCategoryDto) => {
    return prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId ?? null,
      },
    });
  };

  /**
   * Retrieve all category.
   */
  findAll = async () => {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  };

  /**
   * Retrieve a single category.
   */
  findById = async (id: string) => {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  };

  /**
   * Update a category.
   */
  update = async (data: UpdateCategoryDto) => {
    return prisma.category.update({
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
    return prisma.category.delete({
      where: {
        id,
      },
    });
  };
}