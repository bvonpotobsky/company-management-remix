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

export const getLastWeekCompletedShiftsByUserId = async ({id}: {id: UserId}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      userId: id,
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

export const getAllCompletedShiftBetweenDatesByUserId = async ({
  from,
  to,
  userId,
}: {
  from: Date;
  to: Date;
  userId: UserId;
}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      userId: userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    select: {
      id: true,
      start: true,
      end: true,
    },
  });

  return shifts;
};

export const getAllCompletedShiftBetweenDates = async ({from, to}: {from: Date; to: Date}) => {
  const shifts = await prisma.shiftCompleted.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    select: {
      id: true,
      start: true,
      end: true,
    },
  });

  return shifts;
};
