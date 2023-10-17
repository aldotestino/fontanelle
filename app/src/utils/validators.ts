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

export const addFountainSchema = z.object({
  name: z.string().min(1),
  isFree: z.coerce.number().int().min(0).max(1),
});

export type SigninSchema = z.infer<typeof signinSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AddFountainSchema = z.infer<typeof addFountainSchema>