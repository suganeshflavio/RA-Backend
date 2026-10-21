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

        // description: z
        //     .string()
        //     .optional(),

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
            .optional(),

        subjects: z
            .array(z.string())
            .default([])

    })
    // .superRefine((data, ctx) => {

    //     if (
    //         data.accessType === "paid" &&
    //         !data.price
    //     ) {
    //         ctx.addIssue({
    //             code: "custom",
    //             path: ["price"],
    //             message: "Price is required for paid courses"
    //         });
    //     }

    //     if (
    //         data.enableEmi &&
    //         (!data.installments || data.installments.length === 0)
    //     ) {
    //         ctx.addIssue({
    //             code: "custom",
    //             path: ["installments"],
    //             message: "Installments are required when EMI is enabled"
    //         });
    //     }

    // });

    export const updateCourseSchema = createCourseSchema.extend({

    isActive: z.boolean().optional(),

    subjects: z.array(z.string()).optional()

});