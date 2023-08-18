import type {ActionArgs, ActionFunction, LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, Link, useLoaderData} from "@remix-run/react";
import type {ColumnDef} from "@tanstack/react-table";
import type {UserId} from "~/models/user.server";
import type {Invoice as InvoiceType} from "@prisma/client";

import {format} from "date-fns";
import {formatAsPrice} from "~/helpers";
import {requireAdmin} from "~/session.server";

import {createAllUsersInvoicesBetweenDates, getAllInvoices, getAllInvoicesByUserId} from "~/models/invoice.server";

import {Button} from "~/components/ui/button";
import {DataTable} from "~/components/ui/data-table";

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
    cell: ({row}) => (
      <Link to={`./${row.original.id}`} className="capitalize">
        {row.original.id.slice(0, 4)}
      </Link>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({row}) => {
      const id = row.original.id;
      return (
        <Link to={`./${id}`} className="capitalize">
          {row.original.user.name}
        </Link>
      );
    },
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
  invoices: Awaited<ReturnType<typeof getAllInvoices>>;
  adminInvoices: Awaited<ReturnType<typeof getAllInvoicesByUserId>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  const admin = await requireAdmin(request);

  const invoices = await getAllInvoices();
  const adminInvoices = await getAllInvoicesByUserId({id: admin.id});

  return json<Loader>({invoices, adminInvoices});
};

export const action: ActionFunction = async ({request}: ActionArgs) => {
  await requireAdmin(request);

  const invoices = await createAllUsersInvoicesBetweenDates({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return json({invoices});
};

export default function AdminInvoicesRoute() {
  const {invoices, adminInvoices} = useLoaderData<Loader>();

  return (
    <section className="relative flex w-full flex-col items-stretch justify-start">
      <header className="sticky top-0 flex items-center justify-between space-y-0.5 bg-background py-3">
        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
        <Form method="post">
          <Button type="submit" variant="secondary">
            Generate invoices
          </Button>
        </Form>
      </header>

      <DataTable
        data={invoices.map((invoice) => ({
          ...invoice,
          from: new Date(invoice.from),
          to: new Date(invoice.to),
        }))}
        columns={columns}
      />

      <header className="flex items-center justify-between space-y-0.5 bg-background py-3">
        <h2 className="text-xl font-bold tracking-tight">Personal Invoices</h2>
      </header>

      <DataTable
        data={adminInvoices.map((invoice) => ({
          ...invoice,
          from: new Date(invoice.from),
          to: new Date(invoice.to),
        }))}
        columns={columns}
      />
    </section>
  );
}
