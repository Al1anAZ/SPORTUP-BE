/*
  Warnings:

  - You are about to drop the column `color` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `maxPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "maxPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "color",
DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "discountPercent" INTEGER;

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_tag_idx" ON "Product"("tag");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_color_idx" ON "ProductVariant"("color");

-- CreateIndex
CREATE INDEX "ProductVariant_price_idx" ON "ProductVariant"("price");

-- CreateIndex
CREATE INDEX "ProductVariant_stock_idx" ON "ProductVariant"("stock");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_stock_idx" ON "ProductVariant"("productId", "stock");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
