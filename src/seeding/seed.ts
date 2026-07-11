// The script & the datasets are AI generated 🤖

import { prisma } from "../config/prisma.js";
import { ProductStatus } from "../generated/prisma/enums.js";

import fs from "node:fs/promises";
import path from "node:path";

const BATCH = 2000;

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  status: string;
};

type Stock = {
  id: string;
  quantity: string;
  productId: string;
};

type Relation = {
  productId: string;
  categoryId: string;
};

function parseCSV<T>(text: string): T[] {
  // Remove UTF-8 BOM if present
  text = text.replace(/^\uFEFF/, "");

  const lines = text
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  const headers = lines[0]
    .split(",")
    .map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line
      .split(",")
      .map(v => v.trim());

    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] ?? "";
    });

    return obj as T;
  });
}

async function loadCSV<T>(filename: string): Promise<T[]> {
  const file = path.join(process.cwd(), "/src/seeding/data", filename);
  const text = await fs.readFile(file, "utf8");
  return parseCSV<T>(text);
}

async function insertInBatches<T>(
  data: T[],
  fn: (batch: T[]) => Promise<any>
) {
  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH);

    await fn(batch);

    console.log(`${i + batch.length}/${data.length}`);
  }
}

async function main() {
  console.log("Cleaning database...");

  await prisma.categoriesOnProducts.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.categories.deleteMany();

  console.log("Loading CSV files...");

  const categories = await loadCSV<Category>("categories.csv");
  const products = await loadCSV<Product>("products.csv");
  const stocks = await loadCSV<Stock>("stock.csv");
  const relations = await loadCSV<Relation>("categories_on_products.csv");

  console.log("Inserting Categories...");

  await insertInBatches(categories, (batch) =>
    prisma.categories.createMany({
      data: batch,
    })
  );

  console.log("Inserting Products...");

  await insertInBatches(products, (batch) =>
    prisma.product.createMany({
      data: batch.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        price: p.price,
        status: p.status as ProductStatus,
      })),
    })
  );

  console.log("Inserting Stock...");

  await insertInBatches(stocks, (batch) =>
    prisma.stock.createMany({
      data: batch.map((s) => ({
        id: s.id,
        quantity: Number(s.quantity),
        productId: s.productId,
      })),
    })
  );

  console.log("Inserting Relations...");

  await insertInBatches(relations, (batch) =>
    prisma.categoriesOnProducts.createMany({
      data: batch,
      skipDuplicates: true,
    })
  );

  console.log("✅ Seeding complete.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });