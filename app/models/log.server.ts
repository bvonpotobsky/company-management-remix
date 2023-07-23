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
