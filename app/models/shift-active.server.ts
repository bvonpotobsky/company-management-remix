import {json} from "@remix-run/node";
import {prisma} from "~/db.server";
import {createUserLog} from "~/models/log.server";

import type {ProjectId} from "~/models/project.server";
import type {UserId} from "~/models/user.server";

export const createUserActiveShift = async ({userId, projectId}: {userId: UserId; projectId: ProjectId}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return json({error: "User not found"}, {status: 404});
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return json({error: "Project not found"}, {status: 404});
  }

  const shift = await prisma.shiftActive.create({
    data: {
      start: new Date(Date.now()),
      user: {
        connect: {
          id: user.id,
        },
      },
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  });

  if (!shift) {
    return json({error: "Shift not created"}, {status: 500});
  }

  const log = await createUserLog({
    userId: user.id,
    message: `Clock in at ${project.name}`,
    meta: {
      type: "shift",
      action: "create",
    },
  });

  if (!log) {
    // TODO: Handle inside erros
  }

  return shift;
};

export const userCheckOut = async ({userId, shiftId}: {userId: UserId; shiftId: string}) => {
  // Should we check if the user is the same as the shift?

  const shift = await prisma.shiftActive.findUnique({
    where: {
      id: shiftId,
    },
  });

  if (!shift) {
    return json({error: "Shift not found"}, {status: 404});
  }

  const shiftCompleted = await prisma.shiftCompleted.create({
    data: {
      start: shift.start,
      end: new Date(Date.now()),
      user: {
        connect: {
          id: shift.userId,
        },
      },
      project: {
        connect: {
          id: shift.projectId,
        },
      },
    },
  });

  if (!shiftCompleted) {
    return json({error: "Shift not created"}, {status: 500});
  }

  // TODO: check if this is the correct way to delete
  await prisma.shiftActive.delete({
    where: {
      id: shift.id,
    },
  });

  return shiftCompleted;
};

export const getActiveShiftByUserId = async ({id}: {id: UserId}) => {
  const shift = await prisma.shiftActive.findFirst({
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
  });

  return shift;
};
