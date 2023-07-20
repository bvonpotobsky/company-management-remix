import {useLoaderData} from "@remix-run/react";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";

import {requireAdmin} from "~/session.server";

import {getAllProjectsWithMembers} from "~/models/project.server";
import ProjectCard from "~/components/project-card";

export const loader = async ({request}: LoaderArgs) => {
  await requireAdmin(request);

  const projects = await getAllProjectsWithMembers();
  return json({projects});
};

export default function AdminProjectsRoute() {
  const {projects} = useLoaderData<typeof loader>();

  return (
    <section className="flex w-full flex-col items-stretch justify-start">
      <header className="mb-4 flex w-full items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
      </header>

      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </section>
  );
}
