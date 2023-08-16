import {Form, Link, useSearchParams} from "@remix-run/react";
import {RemixFormProvider, useRemixForm} from "remix-hook-form";

import {type NewProject} from "~/models/project.server";

import {format} from "date-fns";
import {cn} from "~/utils";

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
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";

import {CalendarIcon, X} from "lucide-react";

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

  const errors = form.formState.errors;

  const [, setSearchParams] = useSearchParams();
  const onCloseModal = () => setSearchParams({});

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Link to=".?addProject" className={buttonVariants({variant: "secondary"})}>
          Add project
        </Link>
      </AlertDialogTrigger>
      <AlertDialogContent className="h-full overflow-y-scroll">
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
          <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-3">
            <div className="flex flex-col items-stretch space-y-2">
              <Label>Name</Label>
              <Input type="text" {...form.register("name")} />
              {errors.name && <p>{errors.name.message}</p>}
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
              <Label>Street</Label>
              <Input type="text" {...form.register("address.street")} />
              {errors.address && errors.address.street && <p>{errors.address.street.message}</p>}
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <Label>City / Town / Suburb</Label>
              <Input type="text" {...form.register("address.city")} />
              {errors.address && errors.address.city && <p>{errors.address.city.message}</p>}
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <Label>State</Label>
              <Input type="text" {...form.register("address.state")} />
              {errors.address && errors.address.state && <p>{errors.address.state.message}</p>}
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <Label>ZIP Code</Label>
              <Input type="text" {...form.register("address.zip")} />
              {errors.address && errors.address.zip && <p>{errors.address.zip.message}</p>}
            </div>

            <div className="flex flex-col items-stretch space-y-2">
              <Label>Country</Label>
              <Input type="text" {...form.register("address.country")} />
              {errors.address && errors.address.country && <p>{errors.address.country.message}</p>}
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
