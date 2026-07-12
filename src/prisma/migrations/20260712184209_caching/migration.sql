-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Categories_parentId_idx" ON "Categories"("parentId");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
