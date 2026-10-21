import { z } from "zod";

export const createVideoSchema = z.object({

    courseId: z.string().min(1, "Course is required"),

    subject: z.string().optional(),

    chapter: z.string().optional(),

    videoName: z.string().min(3, "Video name is required"),

    videoFileId: z.string().min(1, "videoFileId is required"),

    videoFileName: z.string().min(1, "videoFileName is required"),

    videoSize: z.coerce.number().optional(),

    description: z.string(),

    duration: z.string().optional(),

    order: z.coerce.number().optional(),

    isPreview: z.coerce.boolean().optional()

});

export const updateVideoSchema = createVideoSchema.extend({

    videoFileId: z.string().optional(),

    videoFileName: z.string().optional(),

    isActive: z.boolean().optional()

});

export const videoUploadUrlSchema = z.object({

    fileName: z
        .string()
        .min(1, "fileName is required")
        .refine((name) => /\.mp4$/i.test(name), "Only .mp4 files are supported"),

    courseId: z.string().optional()

});
