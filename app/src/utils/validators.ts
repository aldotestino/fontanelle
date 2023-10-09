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

export type SigninSchema = z.infer<typeof signinSchema>
export type SignupSchema = z.infer<typeof signupSchema>