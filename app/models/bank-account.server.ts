import {z} from "zod";
import {prisma} from "~/db.server";
import type {UserId} from "~/models/user.server";

export const createBankAccountByUserId = async ({
  userId,
  bankAccount,
}: {
  userId: UserId;
  bankAccount: NewBankAccount;
}) => {
  const newBankAccount = await prisma.bankAccount.create({
    data: {
      ...bankAccount,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newBankAccount;
};

// Schema -> Validation
export const NewBankAccountSchema = z
  .object({
    bankName: z.string().min(2).max(50),
    accountNumber: z.string().min(2).max(50),
    bsb: z.string().min(2).max(10),
  })
  .required();

export type NewBankAccount = z.infer<typeof NewBankAccountSchema>;
