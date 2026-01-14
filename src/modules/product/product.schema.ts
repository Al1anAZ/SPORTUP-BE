import { z } from "zod";
import { Prisma, ProductTag } from "@prisma/client";
import { basePaginationSchema } from "@/utils/pagination";

export const productFilteringOptionsSchema = basePaginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "price", "priceMax"])
    .default("createdAt"),

  sortOrder: z.nativeEnum(Prisma.SortOrder).default("desc"),

  categorySlug: z
    .string()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  brandSlug: z
    .string()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  size: z
    .string()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  color: z
    .string()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  minPrice: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: "minPrice must be >= 0",
    }),

  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: "maxPrice must be >= 0",
    }),

  tag: z.enum(ProductTag),
}).partial();

export type productFilteringOptionsDTO = z.infer<
  typeof productFilteringOptionsSchema
>;
