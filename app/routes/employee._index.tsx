import {json} from "@remix-run/node";
import type {LoaderArgs, LoaderFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

import {format} from "date-fns";
import {requireUser} from "~/session.server";

import {getAllProjectsByUserId} from "~/models/project.server";
import {getAllLogsByUserId} from "~/models/log.server";

import ProjectCardEmployee from "~/components/project-card.employee";
import RecentActivity from "~/components/recent-activity";
import RealTimeClock from "~/components/date-real-time";
import {CheckInButton, CheckOutButton} from "~/components/check-in-out.button";

export type LoaderData = {
  projects: Awaited<ReturnType<typeof getAllProjectsByUserId>>;
  logs: Awaited<ReturnType<typeof getAllLogsByUserId>>;
  userName: string;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  const user = await requireUser(request);

  const projects = await getAllProjectsByUserId({id: user.id});
  const logs = await getAllLogsByUserId({id: user.id});

  return json<LoaderData>({projects, logs, userName: user.name});
};

export default function EmployeeRoute() {
  const {projects, logs, userName} = useLoaderData<LoaderData>();

  console.log({logs});

  const date = new Date();

  return (
    <section className="flex-col space-y-4 md:flex">
      <div className="flex w-full items-center justify-between gap-x-2">
        <p className="text-lg font-semibold">{`Hi, ${userName.slice(0, userName.indexOf(" "))}!`}</p>
        <div className="flex flex-col text-right text-sm sm:flex-row">
          <p>
            {format(date, "PPP")} <span className="hidden text-muted-foreground sm:mx-1 sm:inline-block">·</span>
          </p>
          <RealTimeClock />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CheckInButton />
        <CheckOutButton />
      </div>
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
            updatedAt: new Date(log.updatedAt), // Parse the date (this is a string)
          };
        })}
      />
    </section>
  );
}
