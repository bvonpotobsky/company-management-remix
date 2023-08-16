import {useLoaderData} from "@remix-run/react";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

import {requireUserId} from "~/session.server";

import {getAllInvoicesByUserId} from "~/models/invoice.server";

import {DataTable} from "~/components/ui/data-table";
import type {ColumnDef} from "@tanstack/react-table";

import type {Invoice as InvoiceType} from "@prisma/client";
import type {UserId} from "~/models/user.server";
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

type Loader = {
  invoices: Awaited<ReturnType<typeof getAllInvoicesByUserId>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  const userId = await requireUserId(request);
  const invoices = await getAllInvoicesByUserId({id: userId});

  return json<Loader>({invoices});
};

export default function EmployeeInvoicesRoute() {
  const {invoices} = useLoaderData<Loader>();

  return (
    <section className="relative flex w-full flex-col items-stretch justify-start">
      <header className="sticky top-0 flex w-full scroll-m-20 items-center justify-between bg-background py-3">
        <h3 className="text-2xl font-semibold tracking-tight">Invoices</h3>
      </header>

      <DataTable
        data={invoices.map((invoice) => ({
          ...invoice,
          id: invoice.id.slice(0, 3),
          from: new Date(invoice.from),
          to: new Date(invoice.to),
        }))}
        columns={columns}
      />
    </section>
  );
}
