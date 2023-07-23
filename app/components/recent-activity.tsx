import {format} from "date-fns";

import {Badge} from "~/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";

import type {LoaderData} from "~/routes/employee._index";

const RecentActivity: React.FC<{logs: LoaderData["logs"]}> = ({logs}) => {
  return (
    <Card className="col-span-3 border-none">
      <CardHeader className="flex flex-row items-baseline justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Updated <span className="font-semibold">3 minutes</span> ago
        </CardDescription>
      </CardHeader>

      {!logs.length && (
        <CardDescription className="mt-5 text-center font-semibold">No recent activity found</CardDescription>
      )}

      <CardContent>
        {logs.length
          ? logs.map((log) => (
              <div className="my-2 flex items-center space-y-2" key={log.id}>
                <div className="flex space-x-2 space-y-1">
                  <Badge className="rounded-sm text-[10px] uppercase">{log.action}</Badge>
                  <p className="text-sm font-medium leading-none">{log.message}</p>
                </div>

                <div className="ml-auto flex flex-col text-right text-xs text-muted-foreground sm:flex-row">
                  <p>{format(new Date(log.updatedAt), "HH:mmaaa")}</p>
                  <span className="mx-1 hidden sm:inline">·</span>
                  <p>{format(new Date(log.updatedAt), "dd MMM")}</p>
                </div>
              </div>
            ))
          : null}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
