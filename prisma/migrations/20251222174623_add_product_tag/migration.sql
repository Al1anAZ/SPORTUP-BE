/*
  Warnings:

  - Added the required column `tags` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductTag" AS ENUM ('NEW', 'SALE', 'TOP');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tags" "ProductTag" NOT NULL;
