import {prisma} from "~/db.server";

import {calculateHoursWorked} from "~/helpers";
import {getAllCompletedShiftBetweenDatesByUserId} from "~/models/shift-completed.server";

export const getAllInvoices = async () => {
  const invoices = prisma.invoice.findMany({
    select: {
      id: true,
      amount: true,
      status: true,
      from: true,
      to: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return invoices;
};

export const getInvoiceById = async ({id}: {id: string}) => {
  const invoice = prisma.invoice.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      shifts: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
};

export const getAllInvoicesByUserId = async ({id}: {id: string}) => {
  const invoices = prisma.invoice.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      amount: true,
      status: true,
      from: true,
      to: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return invoices;
};

export const createInvoiceByUserId = async ({id, fromDate, toDate}: {id: string; fromDate: Date; toDate: Date}) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      hourlyRate: true,
      invoiceCount: true,
    },
  });

  if (!user) {
    throw new Error("Profile not found");
  }

  const shifts = await getAllCompletedShiftBetweenDatesByUserId({
    userId: user.id,
    from: fromDate,
    to: toDate,
  });

  const totalWorkedInMiliseconds = shifts.reduce((acc, shift) => {
    const hoursWorked = calculateHoursWorked(new Date(shift.start), new Date(shift.end));

    return acc + hoursWorked;
  }, 0);

  const totalWorkedInHours = totalWorkedInMiliseconds / 1000 / 60 / 60;

  const invoice = await prisma.invoice.create({
    data: {
      from: fromDate,
      to: toDate,
      amount: totalWorkedInHours * user.hourlyRate,
      status: "PAID",
      userCount: user.invoiceCount + 1,
      user: {
        connect: {
          id: user.id,
        },
      },
      shifts: {
        connect: shifts.map((shift) => ({id: shift.id})),
      },
    },
  });

  // Increment the invoice count for the user
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      invoiceCount: {
        increment: 1,
      },
    },
  });

  return invoice;
};

export const createAllUsersInvoicesBetweenDates = async ({from, to}: {from: Date; to: Date}) => {
  const _from = new Date(from.setHours(0, 0, 0, 0));
  const _to = new Date(to.setHours(23, 59, 59, 999));

  // ToDo: Optimize this query???
  // VERY VERY CAREFUL WITH THIS QUERY.
  // It will return all profiles that have shifts in the given date range
  // and that don't have invoices in the given date range yet
  const users = await prisma.user.findMany({
    where: {
      shiftCompleted: {
        some: {
          date: {
            gte: _from,
            lte: _to,
          },
        },
      },
      invoices: {
        none: {
          from: _from,
          to: _to,
        },
      },
    },
  });

  const invoices = await Promise.all(
    users.map(async (user) => await createInvoiceByUserId({id: user.id, fromDate: _from, toDate: _to}))
  );

  return invoices;
};
