import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

import {requireAdmin} from "~/session.server";
import {getAllEmployees} from "~/models/employee.server";

import {Button} from "~/components/ui/button";
import {EmployeesTable, columns} from "~/components/employees-table";

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  await requireAdmin(request);
  const employees = await getAllEmployees();

  return json({employees});
};

export default function AdminProjectsRoute() {
  const {employees} = useLoaderData<typeof loader>();

  return (
    <section className="flex w-full flex-col items-stretch justify-start">
      <header className="mb-4 flex w-full items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Invoices</h3>
        <Button variant="secondary">Generate all invoices</Button>
      </header>

      <EmployeesTable columns={columns} data={employees ?? []} />
    </section>
  );
}
