import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {format} from "date-fns";
import AnalyticsCards from "~/components/analytics-cards";
import RealTimeClock from "~/components/date-real-time";
import Overview from "~/components/overview";

import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {requireUser} from "~/session.server";

export type Loader = {
  user: Awaited<ReturnType<typeof requireUser>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  const user = await requireUser(request);

  return json<Loader>({user});
};

export default function NoteIndexPage() {
  const {user} = useLoaderData<Loader>();

  const date = new Date();

  return (
    <section className="relative flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between space-y-0.5 bg-background py-3">
        <p className="text-lg font-semibold">{`Hi, ${user.name.slice(0, user.name.indexOf(" "))}!`}</p>
        <div className="flex flex-row text-right text-sm">
          <p>
            {format(date, "MMM do")}
            <span className="mx-1 inline-block text-muted-foreground">·</span>
          </p>
          <RealTimeClock />
        </div>
      </header>

      <div className="flex flex-col space-y-4">
        <AnalyticsCards />
        <div className="grid w-full gap-3 md:grid-cols-2 lg:grid-cols-6">
          {/* {logs && <RecentLogs logs={logs} />} */}
          <Card className="col-span-3 p-3">
            <CardHeader className="mb-2">
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
