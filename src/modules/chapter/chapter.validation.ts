import { z } from "zod";

export const createChapterSchema = z.object({

    name: z.string().min(1, "Name is required"),

    classId: z.string().min(1, "Class is required")

});

export const updateChapterSchema = z.object({

    name: z.string().min(1).optional(),

    isActive: z.boolean().optional()

});
