import { z } from "zod";

export const createVideoSchema = z.object({

    videoName: z.string().min(3, "Video name is required"),

    videoFileId: z.string().min(1, "videoFileId is required"),

    videoFileName: z.string().min(1, "videoFileName is required"),

    videoSize: z.coerce.number().optional(),

    description: z.string().optional(),

    duration: z.string().optional(),

    isPreview: z.coerce.boolean().optional()

});

export const updateVideoSchema = createVideoSchema.partial().extend({

    isActive: z.boolean().optional()

});

export const videoUploadUrlSchema = z.object({

    fileName: z
        .string()
        .min(1, "fileName is required")
        .refine((name) => /\.mp4$/i.test(name), "Only .mp4 files are supported")

});
