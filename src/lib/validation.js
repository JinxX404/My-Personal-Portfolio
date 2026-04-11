// src/lib/validation.js
import { z } from "zod";

// ==================== PROJECT SCHEMAS ====================

const contentSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Section title is required").max(100),
  content: z.string().min(1, "Section content is required"),
  order: z.number().optional()
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  content_sections: z.array(contentSectionSchema).optional().default([]),
  client: z
    .string()
    .max(100, "Client name must be less than 100 characters")
    .optional()
    .nullable(),
  technologies: z.array(z.string()).optional().default([]),
  demo_url: z
    .string()
    .url("Invalid demo URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  repository_url: z
    .string()
    .url("Invalid repository URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z
    .enum(["draft", "in-progress", "completed", "archived"])
    .default("draft"),
  publishing_status: z
    .enum(["draft", "published", "archived"])
    .default("draft"),
  featured: z.boolean().default(false),
  visibility: z.enum(["public", "private", "password"]).default("public"),
  tags: z.array(z.string()).optional().default([]),
  meta_title: z
    .string()
    .max(70, "Meta title should be under 70 characters")
    .optional()
    .nullable(),
  meta_description: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional()
    .nullable(),
});

export const projectCreateSchema = projectSchema.extend({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

export const projectUpdateSchema = projectSchema.partial();

// ==================== CONTACT FORM SCHEMA ====================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be less than 5000 characters"),
  inquiryType: z
    .enum(["general", "project", "collaboration", "job", "other"])
    .optional(),
});

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ==================== SKILL SCHEMAS ====================

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be less than 50 characters"),
  level: z.number().min(0).max(100).optional().default(50),
  icon: z.string().optional().nullable(),
});

export const skillCategorySchema = z.object({
  key: z
    .string()
    .min(1, "Category key is required")
    .regex(/^[a-z0-9-]+$/, "Key must be lowercase with hyphens"),
  title: z.string().min(1, "Category title is required").max(100),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

// ==================== SETTINGS SCHEMA ====================

export const profileSettingsSchema = z.object({
  full_name: z.string().max(100).optional().nullable(),
  title: z.string().max(100).optional().nullable(),
  tagline: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
});

// ==================== VALIDATION HELPERS ====================

/**
 * Validate data against a schema and return result
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {{ success: boolean, data?: object, errors?: object }}
 */
export const validate = (schema, data) => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    // Handle non-ZodError or malformed ZodError
    const message = error?.message || "Validation failed";
    return { success: false, errors: { _error: message } };
  }
};

/**
 * Safe parse - returns null instead of throwing
 * @param {z.ZodSchema} schema - Zod schema
 * @param {object} data - Data to validate
 * @returns {object|null}
 */
export const safeParse = (schema, data) => {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};
