import {prisma} from "~/db.server";
import {z} from "zod";

import type {Project} from "@prisma/client";
import type {UserId} from "~/models/user.server";

export const getAllProjectsWithMembers = async () => {
  const projects = prisma.project.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      address: true,
    },
  });

  return projects;
};

export const getProjectById = async ({id}: {id: ProjectId}) => {
  const project = prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      status: true,
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      address: true,
    },
  });

  return project;
};

export const createProject = async ({project}: {project: NewProject}) => {
  const newProject = prisma.project.create({
    data: {
      name: project.name,
      startDate: project.startDate,
      status: project.status,
      address: {
        create: {
          street: project.address.state,
          city: project.address.city,
          state: project.address.state,
          zip: project.address.zip,
          country: project.address.country,
        },
      },
    },
  });

  return newProject;
};

export const getAllProjectsByUserId = async ({id}: {id: UserId}) => {
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      status: true,
      startDate: true,
      address: {
        select: {
          street: true,
          city: true,
          state: true,
          zip: true,
          country: true,
        },
      },
    },
  });

  return projects;
};

// Schema -> Validation
export const NewProjectSchema = z
  .object({
    name: z.string(),
    startDate: z.coerce.date(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
  })
  .required();

export type ProjectId = Project["id"];
export type NewProject = z.infer<typeof NewProjectSchema>;
