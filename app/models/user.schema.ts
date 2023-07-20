import {z} from "zod";

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    remember: z.boolean(),
  })
  .required();

export type Login = z.infer<typeof LoginSchema>;

export const NewUserSchema = z
  .object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
    dob: z.coerce.date(),
    phone: z.string().min(10, {message: "Phone number must be at least 10 characters long"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
  })
  .required();

export type NewUser = z.infer<typeof NewUserSchema>;
