/* 
!!!!! DISCLAIMER !!!!! AI GENERATED CODE LIVES HERE !!!!!
* This script was AI generated 🤖 -> The author @iamzehan has nothing to do with it. 
* The CSV datasets used here are also AI generated -> The author @iamzehan has nothing to do with it.
*/

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

import {prisma} from "../config/prisma.js";

import generateSKU from "../utils/generateSKU.js";

import { ProductStatus } from "../generated/prisma/enums.js";

function readCsv<T>(file: string): T[] {
  const content = fs.readFileSync(path.join("./src/seeding/data", file), "utf8");

  return parse(content, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
  }) as T[];
}

type CategoryCSV = {
  name: string;
  description: string;
  parent: string;
};

type ProductCSV = {
  name: string;
  description: string;
  price: string;
  status: ProductStatus;
};

type StockCSV = {
  product: string;
  quantity: string;
};

type CategoryProductCSV = {
  product: string;
  category: string;
};

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await prisma.categoryOnProducts.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Database cleared");
}

async function seedCategories() {
  console.log("📁 Seeding categories...");

  const rows = readCsv<CategoryCSV>("categories.csv");

  // Create all categories first
  for (const row of rows) {
    await prisma.category.create({
      data: {
        name: row.name,
        description: row.description || null,
      },
    });
  }

  // Fetch all categories
  const categories = await prisma.category.findMany();

  const categoryMap = new Map(
    categories.map((category) => [category.name, category.id])
  );

  // Build hierarchy
  for (const row of rows) {
    if (!row.parent) continue;

    const parentId = categoryMap.get(row.parent);

    if (!parentId) {
      throw new Error(
        `Parent category "${row.parent}" not found for "${row.name}".`
      );
    }

    await prisma.category.update({
      where: {
        name: row.name,
      },
      data: {
        parentId,
      },
    });
  }

  console.log(`✅ ${rows.length} categories seeded`);
}

async function seedProducts() {
  console.log("📦 Seeding products...");

  const rows = readCsv<ProductCSV>("products.csv");

  for (const row of rows) {
    await prisma.product.create({
      data: {
        sku: generateSKU(),
        name: row.name,
        description: row.description,
        price: row.price,
        status: row.status,
      },
    });
  }

  console.log(`✅ ${rows.length} products seeded`);
}

async function seedStocks() {
  console.log("📊 Seeding stock...");

  const rows = readCsv<StockCSV>("stock.csv");

  const products = await prisma.product.findMany();

  const productMap = new Map(
    products.map((product) => [product.name, product.id])
  );

  for (const row of rows) {
    const productId = productMap.get(row.product);

    if (!productId) {
      throw new Error(`Product "${row.product}" not found.`);
    }

    await prisma.stock.create({
      data: {
        productId,
        quantity: Number(row.quantity),
      },
    });
  }

  console.log(`✅ ${rows.length} stock records seeded`);
}

async function seedCategoryRelations() {
  console.log("🔗 Seeding category relations...");

  const rows = readCsv<CategoryProductCSV>(
    "categories_on_products.csv"
  );

  const products = await prisma.product.findMany();
  const categories = await prisma.category.findMany();

  const productMap = new Map(
    products.map((product) => [product.name, product.id])
  );

  const categoryMap = new Map(
    categories.map((category) => [category.name, category.id])
  );

  for (const row of rows) {
    const productId = productMap.get(row.product);
    const categoryId = categoryMap.get(row.category);

    if (!productId) {
      throw new Error(`Product "${row.product}" not found.`);
    }

    if (!categoryId) {
      throw new Error(`Category "${row.category}" not found.`);
    }

    await prisma.categoryOnProducts.create({
      data: {
        productId,
        categoryId,
      },
    });
  }

  console.log(`✅ ${rows.length} category relationships seeded`);
}

async function main() {
  console.clear();

  console.log("==========================================");
  console.log("🚀 Starting database seed");
  console.log("==========================================\n");

  await clearDatabase();

  await seedCategories();
  await seedProducts();
  await seedStocks();
  await seedCategoryRelations();

  console.log("\n==========================================");
  console.log("🎉 Database seeded successfully");
  console.log("==========================================");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });