import { productBySlugSelect } from "@/utils/select-query";
import { Prisma } from "@prisma/client";

export type ProductWithVariants = Prisma.ProductGetPayload<{
  select: typeof productBySlugSelect;
}>;

export type ProductVariantDTO = ProductWithVariants["variants"][number];