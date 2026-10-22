import { z } from "zod";

export const createEnquirySchema = z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("valid email is required"),
    category: z.string().trim().min(1, "category is required"),
    message: z.string().trim().min(1, "message is required")
});

export const getEnquiriesQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
});
