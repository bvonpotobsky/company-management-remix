import GoBackURL from "~/components/go-back-url";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Badge} from "~/components/ui/badge";
import {format} from "date-fns";
import {calculateHoursWorked, formatAsPrice} from "~/helpers";
import {Button} from "~/components/ui/button";

// import InvoicePDF from "~/components/pdf/invoice-pdf";
import {getInvoiceById} from "~/models/invoice.server";
import {requireUserId} from "~/session.server";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";
import {useLoaderData} from "@remix-run/react";
// import InvoicePDF from "~/components/pdf/invoice-pdf";

type Loader = {
  invoice: Awaited<ReturnType<typeof getInvoiceById>>;
};

export const loader: LoaderFunction = async ({request, params}: LoaderArgs) => {
  await requireUserId(request);

  invariant(params.id, `You must provide a project id to this route.`);

  const invoice = await getInvoiceById({id: params.id});

  return json<Loader>({invoice});
};

export default function EmployeeInvoiceIdRoute() {
  const {invoice} = useLoaderData<Loader>();

  return (
    <section className="w-full p-2">
      <div className="flex w-full items-center justify-between">
        <GoBackURL to="../invoices" />

        {/* {invoice && (
            <ViewPDFDialog>
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                <InvoicePDF invoice={invoice} />
              </PDFViewer>
            </ViewPDFDialog>
          )} */}
      </div>

      {/* Streaming or suspense */}
      {/* {isLoading && <LoadingInvoices />} */}

      {invoice && (
        <>
          <Card className="my-4 flex w-full items-center justify-between p-4">
            <CardTitle>Status</CardTitle>
            <Badge
            // ToDo: This should be straight from invoice.status
            // variant={invoice.status === "PAID" ? "success" : invoice.status === "UNPAID" ? "pending" : "draft"}
            >
              <span className="capitalize">{invoice.status}</span>
            </Badge>
          </Card>

          <Card className="space-y-4 p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{"Description"}</CardTitle>
              <CardDescription>
                <span className="text-gray-700">#</span>
                {invoice.id}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-between">
              <CardDescription className="flex flex-col">
                <span>Created At</span>{" "}
                <span className="font-semibold text-white">{format(new Date(invoice.createdAt), "PPP")}</span>
              </CardDescription>
              <CardDescription className="flex flex-col text-right">
                <span>Bill To</span> <span className="font-semibold text-white">{invoice.user.name}</span>
              </CardDescription>
            </CardContent>

            <CardContent className="flex justify-between">
              <CardDescription className="flex flex-col">
                <span>Payment Due</span>{" "}
                <span className="font-semibold text-white">{format(new Date(invoice.to), "PPP")}</span>
              </CardDescription>
              <CardDescription className="flex flex-col text-right">
                <span>Sent To</span> <span className="font-semibold dark:text-white">{"bvonpotobsky@gmail.com"}</span>
              </CardDescription>
            </CardContent>

            <CardFooter className="flex flex-row items-center justify-between">
              <CardContent className="flex w-full flex-col justify-center overflow-hidden rounded-lg border bg-slate-100 p-0 dark:bg-slate-900">
                {invoice?.shifts.map((shift) => (
                  <div className="flex h-full flex-row items-center justify-between p-4" key={shift.id}>
                    <CardDescription className="flex flex-col space-y-2">
                      <span className="font-semibold capitalize text-black dark:text-white">{"Trade Assistant"}</span>
                      <span className="font-semibold">
                        {/* // const totalWorkedInHours = totalWorkedInMiliseconds / 1000 / 60 / 60; */}
                        {calculateHoursWorked(new Date(shift.start), new Date(shift.end)) / 1000 / 60 / 60} x{" "}
                        {formatAsPrice(invoice.user.hourlyRate)}
                      </span>
                    </CardDescription>
                    <CardDescription className="flex flex-col font-bold"></CardDescription>
                  </div>
                ))}

                <CardDescription className="flex w-full flex-row items-center justify-between overflow-hidden bg-slate-600 p-4 py-6 text-white dark:bg-black">
                  <span className="font-semibold">Amount Due</span>
                  <span className="text-xl font-semibold">
                    {/* {(calculateHoursWorked(shift.start, shift.end) / 1000 / 60 / 60) * invoice.profile.hourlyRate} */}
                    {/* ${formatAsPrice(getTotalInvoiceAmount(invoice.Items))} */}
                    $20000
                  </span>
                </CardDescription>
              </CardContent>
            </CardFooter>

            <CardFooter className="flex flex-row items-center justify-start space-x-2">
              {/* <Button size="sm" variant="default" onClick={() => sendEmail()}> */}
              <Button size="sm" variant="default">
                Email invoice
              </Button>

              {/* <Button asChild variant="outline" size="sm">
                <PDFDownloadLink
                  document={<InvoicePDF invoice={invoice} />}
                  fileName={`${invoice.profile.lastName}_Invoice.pdf`}
                  className="flex items-center"
                >
                  {({blob, url, loading, error}) =>
                    loading ? (
                      "Loading document..."
                    ) : (
                      <>
                        <Download className="mr-2" />
                        Download
                      </>
                    )
                  }
                </PDFDownloadLink>
              </Button> */}
            </CardFooter>
          </Card>
        </>
      )}
    </section>
  );
}
