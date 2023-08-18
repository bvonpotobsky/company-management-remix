import {z} from "zod";
import {prisma} from "~/db.server";
import {createBankAccountByUserId} from "~/models/bank-account.server";
import {getUserById, type UserId} from "~/models/user.server";

export const getBillingByUserId = async ({id}: {id: UserId}) => {
  const billing = await prisma.billing.findFirst({
    where: {
      userId: id,
    },
    select: {
      id: true,
      abn: true,
      tfn: true,
      bankAccount: {
        select: {
          id: true,
          bankName: true,
          accountNumber: true,
          bsb: true,
        },
      },
    },
  });

  return billing;
};

export const createBillingByUserId = async ({userId, data}: {userId: UserId; data: NewBilling}) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const newBankAccount = await createBankAccountByUserId({
    userId,
    bankAccount: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      bsb: data.bsb,
    },
  });

  const newBilling = await prisma.billing.create({
    data: {
      abn: data.abn,
      tfn: data.tfn,
      bankAccount: {
        connect: {
          id: newBankAccount.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return newBilling;
};

export const updateBillingByUserId = async ({userId, data}: {userId: UserId; data: UpdateBilling}) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const billing = await prisma.billing.findFirst({
    where: {
      userId,
    },
    include: {
      bankAccount: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!billing || !billing.bankAccount) {
    throw new Error(`Billing with userId ${userId} not found`);
  }

  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      id: billing.bankAccount.id,
    },
  });

  if (!bankAccount) {
    throw new Error(`BankAccount with id ${billing.bankAccountId} not found`);
  }

  await prisma.bankAccount.update({
    where: {
      id: bankAccount.id,
    },
    data: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      bsb: data.bsb,
    },
  });

  const updatedBilling = await prisma.billing.update({
    where: {
      id: billing.id,
    },
    data: {
      abn: data.abn,
      tfn: data.tfn,
    },
  });

  return updatedBilling;
};

export const updateOrCreateBillingByUserId = async ({userId, data}: {userId: UserId; data: UpdateBilling}) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const billing = await prisma.billing.findFirst({
    where: {
      userId,
    },
    include: {
      bankAccount: {
        select: {
          id: true,
        },
      },
    },
  });

  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      userId,
    },
  });

  if (!billing && !bankAccount) {
    const newBilling = await createBillingByUserId({
      userId,
      data: {
        abn: data.abn ?? "",
        tfn: data.tfn ?? "",
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        bsb: data.bsb,
      },
    });

    return newBilling;
  }

  if (billing && bankAccount) {
    const updatedBilling = await updateBillingByUserId({
      userId,
      data,
    });

    return updatedBilling;
  }
};

// Schema -> Validation
export const NewBillingSchema = z
  .object({
    bankName: z.string().min(2).max(50),
    accountNumber: z.string().min(2).max(50),
    bsb: z.string().min(2).max(10),
    abn: z.string().min(2).max(50).optional(),
    tfn: z.string().min(2).max(50).optional(),
  })
  .required();

export const UpdateBillingSchema = z.object({
  bankName: z.string().min(2).max(50),
  accountNumber: z.string().min(2).max(50),
  bsb: z.string().min(2).max(10),
  abn: z.string().min(2).max(50).optional(),
  tfn: z.string().min(2).max(50).optional(),
});

export type NewBilling = z.infer<typeof NewBillingSchema>;
export type UpdateBilling = z.infer<typeof UpdateBillingSchema>;
