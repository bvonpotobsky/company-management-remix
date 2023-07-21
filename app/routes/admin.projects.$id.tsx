import {useLoaderData} from "@remix-run/react";
import type {ActionArgs, LoaderArgs, SerializeFrom} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";

import {requireAdmin} from "~/session.server";

import GoBackURL from "~/components/go-back-url";
import {getProjectById} from "~/models/project.server";
import {getValidatedFormData} from "remix-hook-form";
import {
  type AddMemberToProject,
  getAllButMembersOfProjectId,
  AddMemberToProjectSchema,
  addMemberToProject,
} from "~/models/project-member.server";
import AddMemberToProjectForm from "~/components/create-project-member-form";
import {buttonVariants} from "~/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";

export type ProjectLoaderData = {
  project: Awaited<ReturnType<typeof getProjectById>>; // SerializeFrom return error with dates???
  employees: SerializeFrom<typeof getAllButMembersOfProjectId>;
};

export const loader = async ({request, params}: LoaderArgs) => {
  await requireAdmin(request);

  invariant(params.id, `You must provide a project id to this route.`);

  const employees = await getAllButMembersOfProjectId(params.id);

  const project = await getProjectById(params.id);
  return json<ProjectLoaderData>({project, employees});
};

export const resolver = zodResolver(AddMemberToProjectSchema);

export const action = async ({request}: ActionArgs) => {
  console.log("AAaCtion called projects.id");
  console.log({request});

  const {data, errors} = await getValidatedFormData<AddMemberToProject>(request, resolver);

  if (errors) return json({errors});

  const newMember = await addMemberToProject({projectId: data.projectId, userId: data.userId, role: "EMPLOYEE"});
  if (!newMember) return json({errors: {name: "Something went wrong"}}, {status: 500});

  return json({newMember});
};

export default function AdminProjectsRoute() {
  const {project} = useLoaderData<ProjectLoaderData>();

  invariant(project, `You must provide a project id to this route.`);

  return (
    <section className="flex w-full flex-col items-center justify-between">
      <header className="mb-4 flex w-full items-center justify-between">
        <GoBackURL />
        <AddMemberToProjectForm
          projectId={project.id}
          trigger={<button className={buttonVariants({variant: "outline"})}>Add member</button>}
        />
      </header>

      {JSON.stringify(project, null, 2)}
    </section>
  );
}
