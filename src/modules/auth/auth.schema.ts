import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter.",
  });

export const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
});

export type registerInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
