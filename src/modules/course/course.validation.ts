import { z } from "zod";

const installmentSchema = z.object({
    installment: z.number().positive(),
    price: z.number().positive()
});

export const createCourseSchema = z
    .object({

        courseName: z
            .string()
            .min(3, "Course name must contain minimum 3 characters"),

        thumbnail: z
            .string()
            .optional(),

        accessType: z
            .enum(["free", "paid"])
            .default("paid").optional(),

        price: z
            .number()
            .optional(),

        strikePrice: z
            .number()
            .optional(),

        validityMonths: z
            .number()
            .optional(),

        enableEmi: z.boolean().optional(),

        installments: z
            .array(installmentSchema)
            .optional()

    });

export const updateCourseSchema = createCourseSchema.extend({

    isActive: z.boolean().optional()

});

export const linkSubjectSchema = z.object({

    subjectId: z.string().min(1, "subjectId is required"),

    classId: z.string().min(1).optional(),

    order: z.coerce.number().optional()

});

export const linkTopicSchema = z.object({

    topicId: z.string().min(1, "topicId is required"),

    order: z.coerce.number().optional()

});

export const linkVideoSchema = z.object({

    videoId: z.string().min(1, "videoId is required"),

    classId: z.string().min(1).optional(),

    order: z.coerce.number().optional()

});

export const linkNotesSchema = z.object({

    notesId: z.string().min(1, "notesId is required"),

    classId: z.string().min(1).optional(),

    order: z.coerce.number().optional()

});

export const linkMcqTestSchema = z.object({

    testId: z.string().min(1, "testId is required"),

    classId: z.string().min(1).optional(),

    order: z.coerce.number().optional()

});
