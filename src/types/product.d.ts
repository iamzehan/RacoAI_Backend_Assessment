import { Categories, Product, Stock } from "../generated/prisma/client.ts";
import { ProductStatus } from "../generated/prisma/client.ts";

interface ProductQuery {
  page?: number;
  limit?: number;
  status? : ProductStatus
}

interface ProductData extends Product {
    categories?: Categories[];
    stock?: Stock;
}