import { z } from "zod";

export const basePaginationSchema = z.object({
    page: z
      .string()
      .transform((val) => (val ? Number(val) : 1))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Page must be a positive number",
      }),
  
    limit: z
      .string()
      .transform((val) => (val ? Number(val) : 20))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Limit must be a positive number",
      }),
  }).partial();
  