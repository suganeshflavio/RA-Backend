import { z } from "zod";

export const createCommentSchema = z.object({

    videoId: z.string().min(1, "videoId is required"),

    message: z.string().min(1, "message is required")

});

export const replyCommentSchema = z.object({

    message: z.string().min(1, "message is required")

});
