import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  deviceId: z
    .string()
    .min(1, "Device ID is required")
});


export const studentLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
  deviceId: z.string().min(1)
});

export const studentRegisterSchema = z.object({
  name: z.string().min(3, "Name should contain minimum 3 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile is required"),
  class: z.string().min(1, "Class is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  deviceId: z.string().min(1, "Device ID is required")
});

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});