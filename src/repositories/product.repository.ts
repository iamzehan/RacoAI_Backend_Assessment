// import prisma from config
import { prisma } from "../config/prisma.js";
import { ProductData, ProductQuery } from "../types/product.js";
import generateSKU from "../utils/generateSKU.js";

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

  // get all products (READ)
  allProducts = async ({ page, limit, status }: ProductQuery = {}) => {
    // where clause set according to status (Admin can access all status / user can only access active)
    const where = status ? { status } : {};

    // Should this paginate?
    const shouldPaginate =
      page !== undefined && limit !== undefined && page > 0 && limit > 0;

    // calculate total
    const total = await prisma.product.count({ where });

    // get products accordingly
    const products = await prisma.product.findMany({
      where,
      include: {
        categories: true
      },
      ...(shouldPaginate && {
        skip: (page - 1) * limit,
        take: limit
      })
    });

    // return with pagination metadata
    return {
      data: products,
      pagination:
        page && limit
          ? {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page * limit < total
            }
          : null
    };
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
