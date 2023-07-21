import {prisma} from "~/db.server";

import {z} from "zod";
import type {Project} from "@prisma/client";

export const addMemberToProject = async (member: AddMemberToProject) => {
  const newMember = prisma.projectMember.create({
    data: {
      role: member.role,
      user: {
        connect: {
          id: member.userId,
        },
      },
      project: {
        connect: {
          id: member.projectId,
        },
      },
    },
  });

  if (!newMember) {
    throw new Error("Failed to add member to project");
  }

  return newMember;
};

export const getAllButMembersOfProjectId = async (id: Project["id"]) => {
  const members = prisma.user.findMany({
    where: {
      NOT: {
        projectMember: {
          some: {
            projectId: id,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      roles: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return members;
};

// Schema:
export const AddMemberToProjectSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  role: z.enum(["MANAGER", "ADMIN", "SUPERVISOR", "EMPLOYEE"]),
});

export type AddMemberToProject = z.infer<typeof AddMemberToProjectSchema>;