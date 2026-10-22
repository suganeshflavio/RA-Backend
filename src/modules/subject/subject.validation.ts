import { z } from "zod";

export const createSubjectSchema = z.object({

    name: z.string().min(1, "Name is required")

});

export const updateSubjectSchema = createSubjectSchema.partial().extend({

    isActive: z.boolean().optional()

});
