import type {ActionArgs, LoaderArgs, V2_MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";

import {RemixFormProvider, getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {cn} from "~/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";

import {createUser, getUserByEmail} from "~/models/user.server";
import {createUserSession, getUserId} from "~/session.server";

import {Button} from "~/components/ui/button";
import {Calendar} from "~/components/ui/calendar";
import {Input} from "~/components/ui/input";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";

import logo from "~/assets/everest-logo.png";

export const NewUserSchema = z
  .object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
    dob: z.coerce.date(),
    phone: z.string().min(10, {message: "Phone number must be at least 10 characters long"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
  })
  .required();

export type NewUser = z.infer<typeof NewUserSchema>;

const resolver = zodResolver(NewUserSchema);

export const loader = async ({request}: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({request}: ActionArgs) => {
  const {errors, data, receivedValues} = await getValidatedFormData<NewUser>(request, resolver);

  console.log({data, errors, receivedValues});

  if (errors) {
    return json(errors);
  }

  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    return json({
      errors: {
        email: {
          message: "A user with this email already exists.",
          status: 409,
        },
      },
    });
  }

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    dob: data.dob,
    phone: data.phone,
  });

  return createUserSession({
    redirectTo: "/",
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{title: "Sign Up"}];

export default function Join() {
  const form = useRemixForm<NewUser>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: new Date(),
      phone: "",
    },
    resolver,
  });

  return (
    <div className="flex min-h-full flex-col justify-start md:justify-center">
      <Link to="/" className="self-center">
        <img src={logo} alt="Everest Facades Logo" className="mb-14" width={260} height={195} />
      </Link>
      <div className="mx-auto w-full max-w-md px-4 md:px-8">
        <RemixFormProvider {...form}>
          <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-3">
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <Input type="text" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="dob"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
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
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1920}
                          toYear={new Date().getFullYear()}
                          classNames={{
                            caption_label: "hidden",
                            dropdown: "flex items-center space-x-2 bg-background",
                            vhidden: "hidden",
                            caption_dropdowns: "flex items-center space-x-2 bg-background text-white",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Phone</FormLabel>
                    <Input type="tel" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Email</FormLabel>
                    <Input type="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Password</FormLabel>
                    <Input type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <button
              type="submit"
              className="focus:bg-primary-80 hover:bg-primary-90 w-full bg-primary px-4 py-2 text-white"
            >
              Create Account
            </button>
            <div className="flex items-center justify-center">
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link className="text-primary underline" to={{pathname: "/login"}}>
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </RemixFormProvider>
      </div>
    </div>
  );
}
