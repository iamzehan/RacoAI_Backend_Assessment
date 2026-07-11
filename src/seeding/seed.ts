import { prisma } from "../config/prisma.js";
import { ProductStatus } from "../generated/prisma/client.js";

async function main() {
  // product
  const product = await prisma.product.create({
    data: {
      sku: "SKU001",
      name: "Test Product",
      description: "Test Description",
      price: "100"
    },
  });

  console.log(product);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });