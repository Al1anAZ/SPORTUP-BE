import { productReducedSelectDBQuery } from "@/utils/selectDBQuery";
import { Prisma } from "@prisma/client";

export type ProductVariant = Prisma.ProductGetPayload<{
  select: typeof productReducedSelectDBQuery;
}>["variants"][number];
