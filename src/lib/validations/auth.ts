import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Improved password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z\W])(?=.{8,})/;

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" })
    .refine(val => /\d{3}-\d{3}-\d{4}/.test(val) || /\d{10}/.test(val.replace(/\D/g, '')), {
      message: "Phone number must be in XXX-XXX-XXXX format"
    }),
  gender: z.string().min(1, { message: "Please select your gender" }),
  dob: z
    .string()
    .min(1, { message: "Please enter your date of birth" })
    .refine(val => {
      if (!val) return false;
      const date = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return !isNaN(date.getTime()) && date < today && age >= 16;
    }, {
      message: "You must be at least 16 years old to register"
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(val => passwordRegex.test(val), {
      message: "Password must include at least one lowercase letter, one number, and one uppercase letter or special character"
    }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
