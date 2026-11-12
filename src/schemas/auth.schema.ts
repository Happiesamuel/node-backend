import z from "zod";

const nameFieldSchema = z
  .string("Field is required")
  .trim()
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be 50 characters or less")
  .regex(
    /^[\p{L}\s'-]+$/u,
    "Can only contain letters, spaces, hyphens, and apostrophes",
  );

export const loginSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
  password: z.string("Password is required").min(8),
  firstName: nameFieldSchema,
  lastName: nameFieldSchema,
});
export const otpSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
  otp: z
    .string("OTP is required")
    .trim()
    .min(1, "OTP is required")
    .length(6, "OTP must be exactly 6 digits") // Change 6 to your OTP length
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export const forgottenPasswordSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
});
export const resetPasswordSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
  password: z.string("Password is required").min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type otpInput = z.infer<typeof otpSchema>;
export type forgottenPasswordInput = z.infer<typeof forgottenPasswordSchema>;
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
