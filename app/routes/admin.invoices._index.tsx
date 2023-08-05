import type {ActionArgs, ActionFunction, LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";

import {requireAdmin} from "~/session.server";
import {createAllUsersInvoices, getAllInvoices} from "~/models/invoice.server";

import InvoicesTable from "~/components/invoices-table";
import {Button} from "~/components/ui/button";

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

  console.log({invoices});

  return (
    <section className="flex w-full flex-col items-stretch justify-start">
      <header className="mb-4 flex w-full items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Invoices</h3>
        <Form method="post">
          <Button type="submit" variant="secondary">
            Generate invoices
          </Button>
        </Form>
      </header>

      <InvoicesTable
        invoices={invoices.map((invoice) => ({
          ...invoice,
          from: new Date(invoice.from),
          to: new Date(invoice.to),
        }))}
      />
    </section>
  );
}
