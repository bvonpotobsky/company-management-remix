import {prisma} from "~/db.server";

import bcrypt from "bcryptjs";
import {z} from "zod";

import type {Password, User} from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: {id},
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: {email},
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });
}

export async function createUser(user: NewUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: {
      name: user.name,
      dob: user.dob,
      phone: user.phone,
      email: user.email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({where: {email}});
}

export async function verifyLogin(email: User["email"], password: Password["hash"]) {
  const userWithPassword = await prisma.user.findUnique({
    where: {email},
    include: {
      password: true,
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  const {password: _password, ...userWithoutPassword} = userWithPassword;

  return userWithoutPassword;
}

// Schema:

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
