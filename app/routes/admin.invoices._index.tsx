import type {ActionArgs, ActionFunction, LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import type {ColumnDef} from "@tanstack/react-table";
import type {UserId} from "~/models/user.server";
import type {Invoice as InvoiceType} from "@prisma/client";

import {format} from "date-fns";
import {formatAsPrice} from "~/helpers";
import {requireAdmin} from "~/session.server";

import {createAllUsersInvoices, getAllInvoices} from "~/models/invoice.server";

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
  invoices: Awaited<ReturnType<typeof getAllInvoices>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  await requireAdmin(request);
  const invoices = await getAllInvoices();

  return json<Loader>({invoices});
};

export const action: ActionFunction = async ({request}: ActionArgs) => {
  await requireAdmin(request);

  const invoices = await createAllUsersInvoices({
    fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    toDate: new Date(),
  });

  return json({invoices});
};

export default function AdminInvoicesRoute() {
  const {invoices} = useLoaderData<Loader>();

  return (
    <section className="relative flex w-full flex-col items-stretch justify-start">
      <header className="sticky top-0 flex w-full scroll-m-20 items-center justify-between py-3">
        <h3 className="text-2xl font-semibold tracking-tight">Invoices</h3>
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
    </section>
  );
}
