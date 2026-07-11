/*
  Warnings:

  - The values [user,admin,super_admin] on the enum `user_roles_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_roles_enum_new" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "user_roles_enum_new" USING ("role"::text::"user_roles_enum_new");
ALTER TYPE "user_roles_enum" RENAME TO "user_roles_enum_old";
ALTER TYPE "user_roles_enum_new" RENAME TO "user_roles_enum";
DROP TYPE "public"."user_roles_enum_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
