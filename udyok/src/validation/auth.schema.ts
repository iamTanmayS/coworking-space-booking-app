import { z } from "zod";


export const SignupSchema = z.object({
    name: z.string().
        min(3, { message: "Name must be at least 3 characters long" }).
        max(30, { message: "Name must be at most 20 characters long" }),



    email: z.string()
        .email({ message: "Invalid email address" }),


    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(30, { message: "Password must be at most 20 characters long" }),

    termsAndConditions: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
})


export const LoginSchema = z.object({

    email: z.string()
        .email({ message: "Invalid email address" }),


    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(30, { message: "Password must be at most 20 characters long" })
})


export const ResetPasswordSchema = z
    .object({
        newpassword: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(30, { message: "Password must be at most 30 characters long" }),

        confirmpassword: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(30, { message: "Password must be at most 30 characters long" }),
    })
    .refine((data) => data.newpassword === data.confirmpassword, {
        message: "Passwords do not match",
        path: ["confirmpassword"],
    });


export const otpSchema = z.object({
    otp: z.string().regex(/^\d{4}$/, {
        message: "OTP must be exactly 4 digits",
    })
})

export const termsAndConditionsSchema = z
    .boolean()
    .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    })



export type SignupSchemaType = z.infer<typeof SignupSchema>

export type LoginSchemaType = z.infer<typeof LoginSchema>

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>

export type OtpSchemaType = z.infer<typeof otpSchema>

export type TermsAndConditionsSchemaType = z.infer<typeof termsAndConditionsSchema>
