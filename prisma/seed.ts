import {PrismaClient} from "@prisma/client";

import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log(`Seeding database...`);

  // clear db
  await prisma.password.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  const role = await prisma.role.create({
    data: {
      name: "admin",
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      name: "Will Caroll",
      email: "will.admin@test.com",
      dob: new Date("1990-01-01"),
      phone: "1234567890",
      roles: {
        connect: {
          id: role.id,
        },
      },
    },
  });

  await prisma.password.create({
    data: {
      hash: await bcryptjs.hash("admin123", 10),
      user: {
        connect: {
          id: userAdmin.id,
        },
      },
    },
  });

  const userEmployee = await prisma.user.create({
    data: {
      name: "Will Caroll",
      email: "will.employee@test.com",
      dob: new Date("1990-01-01"),
      phone: "1234567890",
    },
  });

  await prisma.password.create({
    data: {
      hash: await bcryptjs.hash("employee123", 10),
      user: {
        connect: {
          id: userEmployee.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
