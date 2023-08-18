import {Link, useLoaderData} from "@remix-run/react";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

import {format} from "date-fns";
import {formatAsPrice} from "~/helpers";

import type {Invoice as InvoiceType} from "@prisma/client";
import type {UserId} from "~/models/user.server";

import {requireUserId} from "~/session.server";
import {getAllInvoicesByUserId} from "~/models/invoice.server";

import {DataTable} from "~/components/ui/data-table";
import type {ColumnDef} from "@tanstack/react-table";

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
    cell: ({row}) => {
      const id = row.original.id;
      return <Link to={`./${id}`}>{id}</Link>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
      const id = row.original.id;

      return (
        <Link to={`./${id}`} className="capitalize">
          {row.original.status.toLowerCase()}
        </Link>
      );
    },
  },
  {
    accessorKey: "to",
    header: "Date",
    cell: ({row}) => {
      const id = row.original.id;
      return (
        <Link to={`./${id}`}>
          {format(row.original.from, "dd/MM")} to {format(row.original.to, "dd/MM")}
        </Link>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({row}) => {
      const id = row.original.id;
      return <Link to={`./${id}`}>{formatAsPrice(row.original.amount)}</Link>;
    },
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
      <header className="sticky top-0 flex flex-col space-y-0.5 bg-background py-3">
        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
        <p className="text-sm text-muted-foreground">View all your received invoices here.</p>
      </header>

      <DataTable
        data={invoices.map((invoice) => ({
          ...invoice,
          id: invoice.id.slice(0, 4),
          from: new Date(invoice.from),
          to: new Date(invoice.to),
        }))}
        columns={columns}
      />
    </section>
  );
}
