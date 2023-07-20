import type {Password, User} from "@prisma/client";
import bcrypt from "bcryptjs";

import {prisma} from "~/db.server";

import type {NewUser} from "~/models/user.schema";
export type {User} from "@prisma/client";

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
