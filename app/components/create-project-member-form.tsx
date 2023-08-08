import {Form, Link, useRouteLoaderData, useSearchParams} from "@remix-run/react";
import {RemixFormProvider, useRemixForm} from "remix-hook-form";

import {type AddMemberToProject} from "~/models/project-member.server";
import type {ProjectLoaderData} from "~/routes/admin.projects.$id";

import {X} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {Button, buttonVariants} from "~/components/ui/button";
import {FormControl, FormField, FormItem, FormMessage} from "~/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";

const AddMemberToProjectForm: React.FC<{projectId: string}> = ({projectId}) => {
  const {employees} = useRouteLoaderData("routes/admin.projects.$id") as ProjectLoaderData;

  const form = useRemixForm<AddMemberToProject>({
    defaultValues: {
      userId: "",
      role: "EMPLOYEE",
      projectId,
    },
  });

  const [searchParams] = useSearchParams();

  const isModalOpen = searchParams.has("addMember") && !form.formState.isSubmitSuccessful;

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger asChild>
        <Link to="/?addMember" className={buttonVariants({variant: "outline"})}>
          Add member
        </Link>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle>Add member</AlertDialogTitle>
          <AlertDialogCancel asChild className={buttonVariants({variant: "ghost", className: "border-none"})}>
            <button onClick={() => searchParams.delete("addMember")}>
              <X />
            </button>
          </AlertDialogCancel>
        </AlertDialogHeader>

        <RemixFormProvider {...form}>
          <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-3" action="/admin.projects.$id">
            <section className="flex items-center justify-between space-x-4">
              <FormField
                control={form.control}
                name="userId"
                render={({field}) => (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" className="text-base" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees?.length ? (
                          employees?.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id}
                              className="cursor-pointer text-base"
                              // disabled={!employee.user.verified}
                            >
                              {employee.name}
                              {/* <span className="text-sm italic">{!employee.user.verified && " · Not verified"}</span> */}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem
                            value="no-avaiable"
                            className="cursor-pointer pl-2 text-sm italic"
                            disabled={true}
                          >
                            No employees available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({field}) => (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Role" className="text-base" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE" className="cursor-pointer text-base">
                          Employee
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <AlertDialogFooter className="flex flex-row items-center justify-end space-x-4 space-y-2">
              <AlertDialogCancel asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button size="sm" type="submit">
                  Add member
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </Form>
        </RemixFormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddMemberToProjectForm;
