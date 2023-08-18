import {json} from "@remix-run/node";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

import {format} from "date-fns";
import {requireUser} from "~/session.server";

import {getAllProjectsByUserId} from "~/models/project.server";
import {getLastWeekCompletedShiftsByUserId} from "~/models/shift-completed.server";
import {getAllLogsByUserId} from "~/models/log.server";

import ProjectCardEmployee from "~/components/project-card.employee";
import RecentActivity from "~/components/recent-activity";
import ShiftsTable from "~/components/shifts-table";
import RealTimeClock from "~/components/date-real-time";

export type LoaderData = {
  userName: string;
  projects: Awaited<ReturnType<typeof getAllProjectsByUserId>>;
  logs: Awaited<ReturnType<typeof getAllLogsByUserId>>;
  latestShifts: Awaited<ReturnType<typeof getLastWeekCompletedShiftsByUserId>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  const user = await requireUser(request);

  const projects = await getAllProjectsByUserId({id: user.id});
  const logs = await getAllLogsByUserId({id: user.id});
  const latestShifts = await getLastWeekCompletedShiftsByUserId({id: user.id});

  return json<LoaderData>({projects, logs, userName: user.name, latestShifts});
};

export default function EmployeeRoute() {
  const {projects, logs, userName, latestShifts} = useLoaderData<LoaderData>();

  const date = new Date();

  return (
    <section className="flex-col md:flex">
      <header className="flex w-full items-center justify-between py-4">
        <p className="text-lg font-semibold">{`Hi, ${userName.slice(0, userName.indexOf(" "))}!`}</p>
        <div className="flex flex-row text-right text-sm">
          <p>
            {format(date, "MMM do")}
            <span className="mx-1 inline-block text-muted-foreground">·</span>
          </p>
          <RealTimeClock />
        </div>
      </header>

      <div className="flex flex-col space-y-4">
        <div className="grid w-full gap-3 md:grid-cols-2 lg:grid-cols-6">
          {projects.map((project) => (
            <ProjectCardEmployee project={project} key={project.id} />
          ))}
        </div>

        <RecentActivity
          logs={logs.map((log) => {
            return {
              ...log,
              createdAt: new Date(log.createdAt), // Parse the date (this is a string)
            };
          })}
        />

        <ShiftsTable
          shifts={latestShifts.map((shift) => {
            return {
              ...shift,
              date: new Date(shift.date),
              start: new Date(shift.start),
              end: new Date(shift.end),
              createdAt: new Date(shift.createdAt),
              updatedAt: new Date(shift.updatedAt),
            };
          })}
        />
      </div>
    </section>
  );
}
