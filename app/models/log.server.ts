import {z} from "zod";
import {prisma} from "~/db.server";

import type {UserId} from "~/models/user.server";

export const getAllLogs = async () => {
  const logs = await prisma.logs.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return logs;
};

export const getAllLogsByUserId = async ({id}: {id: UserId}) => {
  const logs = await prisma.logs.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      message: true,
      meta: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return logs;
};

export const createShiftLog = async ({userId, projectId, message, meta}: CreateShiftLog) => {
  const log = await prisma.logs.create({
    data: {
      message,
      meta,
      user: {
        connect: {
          id: userId,
        },
      },
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  return log;
};

// Schema
const createShiftLogSchema = z.object({
  userId: z.string(),
  message: z.string(),
  projectId: z.string(),
  meta: z.object({
    action: z.enum(["create", "update", "delete"]),
    type: z.enum(["shift"]),
  }),
});

type CreateShiftLog = z.infer<typeof createShiftLogSchema>;
