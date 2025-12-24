import { productBySlugSelect } from "@/utils/selectQuery";
import { Prisma } from "@prisma/client";

export type ProductWithVariants = Prisma.ProductGetPayload<{
  select: typeof productBySlugSelect;
}>;

export type ProductVariantDTO = ProductWithVariants["variants"][number];
