import type {ColumnDef} from "@tanstack/react-table";
import type {UserId} from "~/models/user.server";
import type {Invoice as InvoiceType} from "@prisma/client";

import {format} from "date-fns";
import {formatAsPrice} from "~/helpers";

type Invoice = Pick<InvoiceType, "id" | "amount" | "from" | "to" | "status"> & {
  user: {
    id: UserId;
    name: string;
  };
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => <p className="capitalize">{row.original.status.toLowerCase()}</p>,
  },
  {
    accessorKey: "to",
    header: "Date",
    cell: ({row}) => (
      <p>
        {format(row.original.from, "dd/MM")} to {format(row.original.to, "dd/MM")}
      </p>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({row}) => <p>{formatAsPrice(row.original.amount)}</p>,
  },
];

export default function AdminInvoicesRoute() {
  return (
    <section className="relative flex w-full flex-col items-stretch justify-start">
      <header className="sticky top-0 flex items-center justify-between space-y-0.5 bg-background py-3">
        <h2 className="text-2xl font-bold">Employees</h2>
      </header>
      <h5 className="text-sm text-muted-foreground">Here you will be able to see all the employees.</h5>
    </section>
  );
}
