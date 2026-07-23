import { z } from "zod";

export const signupSchema = z.object({
    userName: z
        .string()
        .trim()
        .min(1,"Username is required")
        .min(3, "Username must be at least 3 characters"),

    email: z
        .string()
        .trim()
        .min(1,"Email is required")
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(1,"Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"]),
})
    .refine((data) => data.password == data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
