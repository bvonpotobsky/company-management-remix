import {Form, useNavigation} from "@remix-run/react";

import {XIcon} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {buttonVariants} from "~/components/ui/button";

interface CheckInProps {
  userId: string;
  projectId: string;
  projectName: string;
}

export const CheckInButton: React.FC<CheckInProps> = ({userId, projectId, projectName}) => {
  const navigation = useNavigation();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({variant: "secondary", className: "font-semibold"})}>
        Check In
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center justify-center overflow-y-scroll">
        <AlertDialogHeader className="flex w-full flex-row items-center justify-end">
          <AlertDialogCancel className={buttonVariants({variant: "ghost", className: "border-none"})}>
            <XIcon />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-lg">
          Are you sure you want to clock In to <span className="font-semibold">{projectName}</span>?
        </AlertDialogDescription>

        <Form method="post" action="/employee/projects/check-in">
          <AlertDialogFooter className="flex flex-row items-center space-x-2">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="projectId" value={projectId} />
            <AlertDialogAction type="submit" className={buttonVariants({variant: "secondary"})}>
              {navigation.state === "submitting" ? "Clocking in..." : "Clock In"}
            </AlertDialogAction>
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface CheckOutProps {
  userId: string;
  shiftId: string;
  projectName: string;
  projectId: string;
}

export const CheckOutButton: React.FC<CheckOutProps> = ({userId, shiftId, projectId, projectName}) => {
  const navigation = useNavigation();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({variant: "secondary", className: "font-semibold"})}>
        Check Out
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center justify-center overflow-y-scroll">
        <AlertDialogHeader className="flex w-full flex-row items-center justify-end">
          <AlertDialogCancel className={buttonVariants({variant: "ghost", className: "border-none"})}>
            <XIcon />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-lg">
          Are you sure you want to clock Out to <span className="font-semibold">{projectName}</span>?
        </AlertDialogDescription>

        <Form method="post" action="/employee/projects/check-out">
          <AlertDialogFooter className="flex flex-row items-center space-x-2">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="activeShiftId" value={shiftId} />
            <input type="hidden" name="projectId" value={projectId} />
            <AlertDialogAction type="submit" className={buttonVariants({variant: "secondary"})}>
              {navigation.state === "submitting" ? "Clocking out..." : "Clock Out"}
            </AlertDialogAction>
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
