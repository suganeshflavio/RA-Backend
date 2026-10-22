import { z } from "zod";

export const createClassSchema = z.object({

    name: z.string().min(1, "Name is required"),

    subjectId: z.string().min(1, "Subject is required")

});

export const updateClassSchema = z.object({

    name: z.string().min(1).optional(),

    isActive: z.boolean().optional()

});
