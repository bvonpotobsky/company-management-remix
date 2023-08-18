import {useLoaderData} from "@remix-run/react";
import type {ActionArgs, LoaderArgs, SerializeFrom} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {zodResolver} from "@hookform/resolvers/zod";

import {requireAdmin} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";

import GoBackURL from "~/components/go-back-url";

import AddMemberToProjectForm from "~/components/create-project-member-form";
import {
  type AddMemberToProject,
  getAllButMembersOfProjectId,
  AddMemberToProjectSchema,
  addMemberToProject,
} from "~/models/project-member.server";

import {getProjectById} from "~/models/project.server";

export type ProjectLoaderData = {
  project: Awaited<ReturnType<typeof getProjectById>>; // SerializeFrom return error with dates???
  employees: SerializeFrom<typeof getAllButMembersOfProjectId>;
};

export const loader = async ({request, params}: LoaderArgs) => {
  await requireAdmin(request);

  invariant(params.id, `You must provide a project id to this route.`);

  const employees = await getAllButMembersOfProjectId({id: params.id});

  const project = await getProjectById({id: params.id});
  return json<ProjectLoaderData>({project, employees});
};

export const resolver = zodResolver(AddMemberToProjectSchema);

export const action = async ({request}: ActionArgs) => {
  const {data, errors} = await getValidatedFormData<AddMemberToProject>(request, resolver);

  if (errors) return json({errors});

  const newMember = await addMemberToProject({projectId: data.projectId, userId: data.userId, role: "EMPLOYEE"});
  if (!newMember) return json({errors: {name: "Something went wrong"}}, {status: 500});

  return redirect(`/admin/projects/${data.projectId}`);
};

export default function AdminProjecIdRoute() {
  const {project} = useLoaderData<ProjectLoaderData>();

  invariant(project, `You must provide a project id to this route.`);

  return (
    <section className="relative flex w-full flex-col items-center justify-between">
      <header className="sticky top-0 flex w-full items-center justify-between space-y-0.5 bg-background py-3">
        <GoBackURL to="../projects" />
        <AddMemberToProjectForm projectId={project.id} />
      </header>

      <main className="flex w-full flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Project: {project.name}</h1>
        <h2 className="text-xl font-bold">Members</h2>
        <ul className="flex w-full flex-col items-center justify-center space-y-4">
          {project.members.map((member) => (
            <li key={member.id} className="flex w-full flex-col items-center justify-center space-y-2">
              <span>{member.user.name}</span>
              <span>{member.role}</span>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
