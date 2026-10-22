import { z } from "zod";

export const createNotesSchema = z.object({

    title: z.string().min(3, "Title is required"),

    description: z.string().optional()

});

export const updateNotesSchema = createNotesSchema.partial().extend({

    isActive: z.boolean().optional()

});
