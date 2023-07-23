import {prisma} from "~/db.server";

export const getAllEmployees = async () => {
  const employees = prisma.user.findMany({
    where: {
      roles: {
        some: {
          name: "EMPLOYEE",
        },
      },
    },
  });

  if (!employees) {
    throw new Error("Employees not found");
  }

  return employees;
};

export const getAllButMembersOfProjectId = async ({projectId}: {projectId: string}) => {
  const employees = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          name: "EMPLOYEE",
        },
      },
      NOT: {
        projectMember: {
          some: {
            projectId: projectId,
          },
        },
      },
    },
  });

  return employees;
};

export const getEmployeeById = async ({id}: {id: string}) => {
  const employee = await prisma.user.findUnique({
    where: {
      id: id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      verified: true,
      roles: {
        select: {
          name: true,
          permissions: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};
