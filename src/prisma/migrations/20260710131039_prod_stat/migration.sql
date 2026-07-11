/*
  Warnings:

  - The values [active,inactive] on the enum `product_status_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "product_status_enum_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "product_status_enum_new" USING ("status"::text::"product_status_enum_new");
ALTER TYPE "product_status_enum" RENAME TO "product_status_enum_old";
ALTER TYPE "product_status_enum_new" RENAME TO "product_status_enum";
DROP TYPE "public"."product_status_enum_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
