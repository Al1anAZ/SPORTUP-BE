import { z } from "zod";
import { ProductTag } from "@prisma/client";

export const productPaginationAndFilterSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 20))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Limit must be a positive number",
    }),

  sortBy: z
    .string()
    .optional()
    .refine((val) => ["createdAt", "price", "name"].includes(val || ""), {
      message: "Invalid sortBy value",
    })
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),

  categorySlug: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  brandSlug: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  size: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  color: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

  minPrice: z
    .string()
    .optional()
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
    
  tag: z.enum(ProductTag).optional()
});

export type productPaginationAndFilterInput = z.infer<
  typeof productPaginationAndFilterSchema
>;
