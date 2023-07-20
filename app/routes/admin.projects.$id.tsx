import {useLoaderData} from "@remix-run/react";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";

import {requireAdmin} from "~/session.server";

import {getProjectById} from "~/models/project.server";
import GoBackURL from "~/components/go-back-url";
import NewProjectForm from "~/components/new-project-form";

export const loader = async ({request, params}: LoaderArgs) => {
  await requireAdmin(request);

  invariant(params.id, `You must provide a project id to this route.`);

  const project = await getProjectById(params.id);
  return json({project});
};

export default function AdminProjectsRoute() {
  const {project} = useLoaderData<typeof loader>();

  return (
    <section className="flex w-full flex-col items-center justify-between">
      <header className="mb-4 flex w-full items-center justify-between">
        <GoBackURL />
        <NewProjectForm />
      </header>

      {JSON.stringify(project, null, 2)}
    </section>
  );
}
