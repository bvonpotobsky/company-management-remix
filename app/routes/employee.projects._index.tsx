import {useLoaderData} from "@remix-run/react";
import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";

import {requireUserId} from "~/session.server";
import type {NewProject} from "~/models/project.server";
import {createProject, NewProjectSchema, getAllProjectsByUserId} from "~/models/project.server";

import {getValidatedFormData} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import ProjectCardEmployee from "~/components/project-card.employee";

export const loader = async ({request}: LoaderArgs) => {
  const userId = await requireUserId(request);

  const projects = await getAllProjectsByUserId({id: userId});
  return json({projects});
};

const resolver = zodResolver(NewProjectSchema);

export const action = async ({request}: ActionArgs) => {
  const {data, errors} = await getValidatedFormData<NewProject>(request, resolver);

  if (errors) return json({errors});

  const project = await createProject({project: data});
  if (!project) return json({errors: {name: "Something went wrong"}}, {status: 500});

  return json({project});
};

export default function AdminProjectsRoute() {
  const {projects} = useLoaderData<typeof loader>();

  return (
    <section className="relative flex w-full flex-col items-stretch justify-start">
      <header className="sticky top-0 flex w-full scroll-m-20 items-center justify-between bg-background py-3">
        <h3 className="text-2xl font-semibold tracking-tight">Projects</h3>
        {/* <NewProjectForm /> */}
      </header>

      {projects.map((project) => (
        <ProjectCardEmployee project={project} key={project.id} />
      ))}
    </section>
  );
}
