import {prisma} from "~/db.server";
import type {ProjectId} from "~/models/project.server";
import type {UserId} from "~/models/user.server";

export const getAllCompletedShiftsByUserId = async ({id}: {id: UserId}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      userId: id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return shifts;
};

export const getLastWeekCompletedShiftsByUserId = async ({userId}: {userId: UserId}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      userId,
      date: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return shifts;
};

export const getAllCompletedShiftsByUserIdAndProjectId = async ({
  userId,
  projectId,
}: {
  userId: UserId;
  projectId: ProjectId;
}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      userId,
      projectId: projectId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return shifts;
};
