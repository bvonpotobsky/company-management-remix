import {prisma} from "~/db.server";

import {calculateHoursWorked} from "~/helpers";

export const getAllInvoices = async () => {
  const invoices = prisma.invoice.findMany({
    include: {
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

export const getCurrentUserInvoice = async ({id}: {id: string}) => {
  const invoices = prisma.invoice.findMany({
    where: {
      userId: id,
    },
    include: {
      user: true,
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
    },
  });

  if (!user) {
    throw new Error("Profile not found");
  }

  const shifts = await prisma.shiftDone.findMany({
    where: {
      userId: user.id,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  const totalWorkedInMiliseconds = shifts.reduce((acc, shift) => {
    const hoursWorked = calculateHoursWorked(new Date(shift.start), new Date(shift.end));

    return acc + hoursWorked;
  }, 0);

  const totalWorkedInHours = totalWorkedInMiliseconds / 1000 / 60 / 60;

  const invoice = prisma.invoice.create({
    data: {
      from: fromDate,
      to: toDate,
      amount: totalWorkedInHours * user.hourlyRate,
      status: "PAID",
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

  return invoice;
};

export const createAllUsersInvoices = async ({fromDate, toDate}: {fromDate: Date; toDate: Date}) => {
  const _from = new Date(fromDate.setHours(0, 0, 0, 0));
  const _to = new Date(toDate.setHours(23, 59, 59, 999));

  // ToDo: Optimize this query???
  const users = await prisma.user.findMany({
    // VERY VERY CAREFUL WITH THIS QUERY.
    // It will return all profiles that have shifts in the given date range
    // and that don't have invoices in the given date range yet
    where: {
      shiftDone: {
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
    users.map(async (user) => {
      const shifts = await prisma.shiftDone.findMany({
        where: {
          userId: user.id,
          date: {
            gte: _from,
            lte: _to,
          },
        },
      });

      const totalWorkedInMiliseconds = shifts.reduce((acc, shift) => {
        const hoursWorked = calculateHoursWorked(new Date(shift.start), new Date(shift.end ? shift.end : shift.start));

        return acc + hoursWorked;
      }, 0);

      const totalWorkedInHours = totalWorkedInMiliseconds / 1000 / 60 / 60;

      const invoice = prisma.invoice.create({
        data: {
          from: _from,
          to: _to,
          amount: totalWorkedInHours * user.hourlyRate,
          status: "PAID",
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

      return invoice;
    })
  );
  return invoices;
};
