// import prisma from config
import { prisma } from "../config/prisma.js";
import { ProductWhereInput } from "../generated/prisma/models.js";
import { ProductData, ProductQuery } from "../types/product.js";
import generateSKU from "../utils/generateSKU.js";
import { parsePrismaOrderBy } from "../utils/lib.js";

export class ProductRepository {
  constructor() {}

  // Generate SKU
  generateUniqueSKU = async () => {
    while (true) {
      const sku = generateSKU();

      const exists = await prisma.product.findUnique({
        where: {
          sku
        }
      });

      if (!exists) {
        return sku;
      }
    }
  };

  // create a product (CREATE)
  createProduct = async (data: ProductData) => {
    // Unpack product data
    const { categories, stock, ...productData } = data;

    // create product transaction
    const createdProduct = await prisma.$transaction(async (tx) => {
      // create product
      await tx.product.create({
        data: productData
      });

      // add categories
      if (categories) {
        await tx.categoriesOnProducts.createMany({
          data: categories.map((category) => ({
            productId: productData.id,
            categoryId: category.id
          }))
        });
      }

      // create stock
      if (stock) {
        await tx.stock.create({
          data: {
            productId: productData.id,
            quantity: stock.quantity
          }
        });
      }
      return true;
    });
    return createdProduct;
  };

  // find products by filter
  findProducts = async ({
    page,
    limit,
    status,
    categoryIds,
    search,
    sort
  }: ProductQuery = {}) => {
    const where: ProductWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    if (categoryIds?.length) {
      where.categories = {
        some: {
          categoryId: {
            in: categoryIds
          }
        }
      };
    }

    const orderBy = sort ? parsePrismaOrderBy(sort) : undefined;

    const shouldPaginate =
      page !== undefined && limit !== undefined && page > 0 && limit > 0;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          stock: true,
          categories: {
            include: {
              categories: true
            }
          }
        },
        ...(shouldPaginate && {
          skip: (page - 1) * limit,
          take: limit
        })
      }),

      prisma.product.count({
        where
      })
    ]);

    return {
      data: products,
      pagination: shouldPaginate
        ? {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1
          }
        : null
    };
  };

  // find one product by id (for details)
  findOne = async (id: string) => {
    const product = await prisma.product.findFirst({
      where: {
        id
      },
      include: {
        categories: {
          include: {
            categories: true
          }
        },
        stock: true
      }
    });
    return product;
  };

  // update a product (UPDATE)
  udpateProduct = async (data: ProductData) => {
    // Unpack product data
    const { categories, stock, ...productData } = data;
    // update product transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      if (categories) {
        // Delete old categories
        await tx.categoriesOnProducts.deleteMany({
          where: {
            productId: productData.id
          }
        });

        // Add new categories
        await tx.categoriesOnProducts.createMany({
          data: categories.map((category) => ({
            productId: productData.id,
            categoryId: category.id
          }))
        });
      }

      // update stock
      if (stock) {
        await tx.stock.update({
          where: {
            productId: stock.productId
          },
          data: {
            quantity: stock.quantity
          }
        });
      }

      // update other data
      await tx.product.update({
        where: {
          id: productData.id
        },
        data: productData
      });

      return true;
    });

    return updatedProduct;
  };

  // Delete a Product (DELETE)
  deleteProduct = async (productId: string) => {
    const result = await prisma.product.delete({
      where: {
        id: productId
      }
    });
    return result;
  };

  // Delete Multiple Product (DELETE*)
  deleteMultipleProduct = async (productIds: string[]) => {
    const results = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    });
    return results;
  };
}
