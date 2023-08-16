import {useLoaderData} from "@remix-run/react";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";

import {requireUserId} from "~/session.server";
import type {UserId} from "~/models/user.server";

import {getProjectById} from "~/models/project.server";

import GoBackURL from "~/components/go-back-url";
import {CheckInButton, CheckOutButton} from "~/components/check-in-out.button";
import {getActiveShiftByUserId} from "~/models/shift-active.server";
import {Badge} from "~/components/ui/badge";

export type ProjectLoaderData = {
  project: Awaited<ReturnType<typeof getProjectById>>; // SerializeFrom return error with dates???
  activeShift: Awaited<ReturnType<typeof getActiveShiftByUserId>>;
  userId: UserId;
};

export const loader = async ({request, params}: LoaderArgs) => {
  const userId = await requireUserId(request);

  invariant(params.id, `You must provide a project id to this route.`);

  const project = await getProjectById({id: params.id});
  const activeShift = await getActiveShiftByUserId({id: userId});
  return json<ProjectLoaderData>({project, userId, activeShift});
};

// export const action = async ({request}: ActionArgs) => {
//   // Clock In / Clock Out
// }

export default function EmployeeProjectIdRoute() {
  const {project, userId, activeShift} = useLoaderData<ProjectLoaderData>();
  invariant(project, `You must provide a project id to this route.`);

  return (
    <section className="relative flex w-full flex-col items-center justify-between">
      <header className="sticky top-0 flex w-full scroll-m-20 items-center justify-between bg-background py-3">
        <GoBackURL to="../projects" />

        <Badge className="text-base" variant="sucess">
          {project.status}
        </Badge>
      </header>

      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {activeShift ? (
          <CheckOutButton shiftId={activeShift.id} projectId={project.id} projectName={project.name} />
        ) : (
          <CheckInButton userId={userId} projectId={project.id} projectName={project.name} />
        )}
      </div>

      <p className="text-lg">{project.address.city}</p>

      {activeShift && <p>You are currently clocked in to this project.</p>}
    </section>
  );
}
