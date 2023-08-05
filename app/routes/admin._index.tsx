import AnalyticsCards from "~/components/analytics-cards";
import Overview from "~/components/overview";

import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";

export default function NoteIndexPage() {
  return (
    <section className="flex-col space-y-4 md:flex">
      <AnalyticsCards />
      <div className="grid w-full gap-3 md:grid-cols-2 lg:grid-cols-6">
        {/* {logs && <RecentLogs logs={logs} />} */}
        <Card className="col-span-3 p-3">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
