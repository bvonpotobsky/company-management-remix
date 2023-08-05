import {useLoaderData} from "@remix-run/react";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

import {requireUserId} from "~/session.server";

import {getAllInvoicesByUserId} from "~/models/invoice.server";

import InvoicesTable from "~/components/invoices-table";

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
    <section className="flex w-full flex-col items-stretch justify-start">
      <header className="mb-4 flex w-full items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Invoices</h3>
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
