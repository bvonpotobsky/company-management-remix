import {type ActionArgs, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {userCheckOut} from "~/models/shift-active.server";

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData();

  const userId = formData.get("userId");
  const activeShiftId = formData.get("activeShiftId");
  const projectId = formData.get("projectId");

  invariant(projectId && typeof projectId === "string", `You must provide a user id to this route.`);
  invariant(activeShiftId && typeof activeShiftId === "string", `You must provide a shift id to this route.`);
  invariant(userId && typeof userId === "string", `You must provide a user id to this route.`);

  const shiftClosed = await userCheckOut({userId, shiftId: activeShiftId});
  invariant(shiftClosed, `Could not close shift.`);

  return redirect(`/employee/projects/${projectId}`);
};
