import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const signupResolver = zodResolver(signupSchema);

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(loginSchema);

export const clientSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
  })
  .refine((data) => /^\d+$/.test(data.phone), {
    message: "Phone number must contain only digits",
    path: ["phone"],
  });

export type ClientFormData = z.infer<typeof clientSchema>;

export const clientResolver = zodResolver(clientSchema);

export const productSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z
      .string()
      .max(200, "Description must be at most 200 characters"),
    price: z.number(),
    tax: z.number(),
  })
  .refine((data) => data.tax >= 0 && data.tax <= 100, {
    message: "Tax must be between 0 and 100",
    path: ["tax"],
  });

export type ProductFormData = z.infer<typeof productSchema>;

export const productResolver = zodResolver(productSchema);
