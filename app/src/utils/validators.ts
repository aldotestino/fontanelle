import * as z from 'zod';

const baseUser = {
  email: z.string().email(),
  password: z.string().min(5)
};

export const signinSchema = z.object({
  ...baseUser
});

export const signupSchema = z.object({
  ...baseUser,
  name: z.string().min(1),
  surname: z.string().min(1),
});

export const addPartialFountainSchema = z.object({
  name: z.string().min(1),
  isFree: z.coerce.number().int().min(0).max(1),
});

export const reportPartialFountainSchema = z.object({
  reason: z.coerce.number().min(1).max(5)
});


export type SigninSchema = z.infer<typeof signinSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AddPartialFountainSchema = z.infer<typeof addPartialFountainSchema>
export type ReportPartialFountainSchema = z.infer<typeof reportPartialFountainSchema>