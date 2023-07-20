import {prisma} from "~/db.server";

import type {z} from "zod";
import type {NewProject, NewProjectSchema} from "~/models/project.schema";
import type {Project} from "@prisma/client";

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

export const getProjectById = async (id: Project["id"]) => {
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

export const createProject = async (project: NewProject) => {
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
