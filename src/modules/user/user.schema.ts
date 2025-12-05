import z from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
      .optional(),
    address: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });
