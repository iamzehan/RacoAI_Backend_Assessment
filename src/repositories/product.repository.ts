// import prisma from config
import { prisma } from "../config/prisma.js";

export class ProductRepository {
  constructor() {}
  // find all products

  allProducts = async ({ page, limit }: ProductQuery = {}) => {
    
    // where clause empty
    const where = {};

    // Should this paginate? 
    const shouldPaginate =
      page !== undefined && 
      limit !== undefined && 
      page > 0 && 
      limit > 0;

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
}
