import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    userId: z
      .string(),
      // .regex(/^(26STD\d{4}|26MEN\d{3})$/, "Invalid User ID format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
export const addStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    photo: z.string().url().optional(),
    social_links: z.object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }).optional(),
  }),
});
