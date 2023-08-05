import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";

import {format} from "date-fns";
import {formatAsPrice} from "~/helpers";

import type {Invoice} from "@prisma/client";
import type {UserId} from "~/models/user.server";

type InvoiceType = Pick<Invoice, "id" | "amount" | "from" | "to" | "status"> & {
  user: {
    id: UserId;
    name: string;
  };
};

const InvoicesTable: React.FC<{invoices: InvoiceType[]}> = ({invoices}) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell className="capitalize">{invoice.status.toLowerCase()}</TableCell>
            <TableCell>
              {format(invoice.from, "dd/MM")} to {format(invoice.to, "dd/MM")}
            </TableCell>
            <TableCell className="text-right">{formatAsPrice(invoice.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoicesTable;
