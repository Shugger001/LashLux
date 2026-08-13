import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20)
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const bookingDetailsSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(80),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  notes: z.string().max(500).optional(),
});

export const bookingApiSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}/),
  fullName: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  notes: z.string().max(500).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().min(0),
  duration: z.coerce.number().int().min(15).max(360),
  category: z.string().min(2).max(40),
  image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  client_name: z.string().min(2).max(80),
  content: z.string().min(10).max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  service_used: z.string().max(100).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;
export type BookingApiInput = z.infer<typeof bookingApiSchema>;
