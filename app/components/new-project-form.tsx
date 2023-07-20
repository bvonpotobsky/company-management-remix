import type {ActionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";

import {Form} from "@remix-run/react";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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

import {CalendarIcon, X} from "lucide-react";

import {createProject} from "~/models/project.server";
import {NewProjectSchema} from "~/models/project.schema";
import type {NewProject} from "~/models/project.schema";
import {useState} from "react";

const resolver = zodResolver(NewProjectSchema);

export const action = async ({request}: ActionArgs) => {
  const {data, errors} = await getValidatedFormData<NewProject>(request, resolver);

  if (errors) return json({errors});

  const project = await createProject(data);
  if (!project) return json({errors: {name: "Something went wrong"}}, {status: 500});

  return json({project});
};

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
    resolver,
  });

  const errors = form.formState.errors;

  const [date, setDate] = useState<Date>(new Date(Date.now()));

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({variant: "secondary"})}>Create Project</AlertDialogTrigger>
      <AlertDialogContent className="h-full overflow-y-scroll">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle>New project</AlertDialogTitle>
          <AlertDialogCancel className={buttonVariants({variant: "ghost", className: "border-none"})}>
            <X />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-2">
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Name</Label>
            <Input type="text" {...form.register("name")} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div className="flex flex-col items-stretch space-y-2">
            <Label>Starting date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            <Label>City / Town / Suburb</Label>
            <Input type="text" {...form.register("address.state")} />
            {errors.address && errors.address.state && <p>{errors.address.state.message}</p>}
          </div>

          <div className="flex flex-col items-stretch space-y-2">
            <Label>City / Town / Suburb</Label>
            <Input type="text" {...form.register("address.zip")} />
            {errors.address && errors.address.zip && <p>{errors.address.zip.message}</p>}
          </div>

          <div className="flex flex-col items-stretch space-y-2">
            <Label>City / Town / Suburb</Label>
            <Input type="text" {...form.register("address.country")} />
            {errors.address && errors.address.country && <p>{errors.address.country.message}</p>}
          </div>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewProjectForm;
