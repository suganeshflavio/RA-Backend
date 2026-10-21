import { z } from "zod";

export const createTestimonialSchema = z.object({

    star: z.coerce.number().int().min(1).max(5),

    review: z.string().min(1, "review is required")

});

export const updateTestimonialSchema = z.object({

    star: z.coerce.number().int().min(1).max(5).optional(),

    review: z.string().min(1).optional(),

    isActive: z.boolean().optional()

});
