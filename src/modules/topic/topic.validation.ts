import { z } from "zod";

export const createTopicSchema = z.object({

    name: z.string().min(1, "Name is required"),

    chapterId: z.string().min(1, "Chapter is required"),

    order: z.coerce.number().optional()

});

export const updateTopicSchema = z.object({

    name: z.string().min(1).optional(),

    order: z.coerce.number().optional(),

    isActive: z.boolean().optional()

});

export const linkVideoSchema = z.object({

    videoId: z.string().min(1, "videoId is required")

});

export const linkMcqTestSchema = z.object({

    testId: z.string().min(1, "testId is required")

});

export const linkNotesSchema = z.object({

    notesId: z.string().min(1, "notesId is required")

});
