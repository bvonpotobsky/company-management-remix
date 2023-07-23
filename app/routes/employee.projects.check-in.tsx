import {type ActionArgs, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {createUserActiveShift} from "~/models/shift-active.server";

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData();

  const userId = formData.get("userId");
  const projectId = formData.get("projectId");

  invariant(projectId && typeof projectId === "string", `You must provide a project id to this route.`);
  invariant(userId && typeof userId === "string", `You must provide a user id to this route.`);

  const shift = await createUserActiveShift({userId, projectId});
  invariant(shift, `Failed to create a new active shift for user ${userId} and project ${projectId}.`);

  return redirect(`/employee/projects/${projectId}`);
};
