import {Form, Link, useSearchParams} from "@remix-run/react";
import {RemixFormProvider, useRemixForm} from "remix-hook-form";

import {type NewProject} from "~/models/project.server";

import {format} from "date-fns";
import {cn} from "~/utils";
import {CalendarIcon, X} from "lucide-react";

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
import {Calendar} from "~/components/ui/calendar";
import {Input} from "~/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";

const defaultValues: Partial<NewProject> = {
  name: "",
  startDate: new Date(Date.now()),
  status: "ACTIVE",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
};

const NewProjectForm: React.FC = () => {
  const form = useRemixForm<NewProject>({
    mode: "onSubmit",
    defaultValues,
  });

  const [, setSearchParams] = useSearchParams();
  const onCloseModal = () => setSearchParams({});

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Link to=".?addProject" className={buttonVariants({variant: "secondary"})}>
          Add project
        </Link>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-full flex-col overflow-y-scroll">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle>New project</AlertDialogTitle>
          <AlertDialogCancel
            className={buttonVariants({variant: "ghost", className: "border-none"})}
            onClick={onCloseModal}
          >
            <X />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <RemixFormProvider {...form}>
          <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-3" method="post">
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Starting date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left text-base font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="address.street"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="address.city"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>City / Town / Suburb</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="address.state"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="address.zip"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="address.country"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="flex flex-row items-center space-x-2">
              <AlertDialogAction asChild>
                <Button type="submit">Add project</Button>
              </AlertDialogAction>
              <AlertDialogCancel className="mt-0" asChild>
                <Button variant="ghost" onClick={onCloseModal}>
                  Cancel
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </Form>
        </RemixFormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewProjectForm;
