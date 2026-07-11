import { Categories, Product, Stock } from "../generated/prisma/client.ts";
import { ProductStatus } from "../generated/prisma/client.ts";

export interface ProductQuery {
  page?: number;
  limit?: number;

  status?: ProductStatus;

  category?: string;
  search?: string;

  minPrice?: number;
  maxPrice?: number;

  sort?: string;
}

interface ProductData extends Product {
    categories?: Categories[];
    stock?: Stock;
}