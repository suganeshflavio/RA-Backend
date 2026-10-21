import { z } from "zod";

export const createUserSchema = z.object({

    name: z
        .string()
        .min(3, "Name should contain minimum 3 characters"),

    email: z
        .string()
        .email("Invalid Email"),

    password: z
        .string()
        .min(6, "Password should contain minimum 6 characters"),

    mobile: z
        .string(),

    class: z
        .string()
        .min(1, "Class is required"),

    isActive: z
        .boolean()
        .optional()

});

export const updateUserSchema = z.object({

    name: z
        .string()
        .min(3, "Name should contain minimum 3 characters")
        .optional(),

    email: z
        .string()
        .email("Invalid Email")
        .optional(),

    password: z
        .string()
        .min(6, "Password should contain minimum 6 characters")
        .optional(),

    mobile: z
        .string()
        .optional(),

    class: z
        .string()
        .min(1, "Class is required")
        .optional(),

    isActive: z
        .boolean()
        .optional()

});
