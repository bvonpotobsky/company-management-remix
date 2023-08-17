import type {ActionArgs, LoaderArgs, V2_MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";

import {z} from "zod";
import {RemixFormProvider, getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {verifyLogin} from "~/models/user.server";
import {createUserSession, getUserId} from "~/session.server";

import {Button} from "~/components/ui/button";
import {Checkbox} from "~/components/ui/checkbox";
import {Input} from "~/components/ui/input";
import {FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";

export const LoginSchema = z
  .object({
    email: z.string().email({message: "Insert a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    remember: z.boolean(),
  })
  .required();

export type Login = z.infer<typeof LoginSchema>;

const resolver = zodResolver(LoginSchema);

export const loader = async ({request}: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({request}: ActionArgs) => {
  const {data, errors} = await getValidatedFormData<Login>(request, resolver);

  if (errors) {
    return json({errors});
  }

  const user = await verifyLogin(data.email, data.password);

  if (!user) {
    return json({errors: {email: "Invalid email or password", password: null}}, {status: 400});
  }

  // ToDo: Add log/metric. Maybe add a "last login" field to the user model, something!.
  const isAdmin = user?.roles.find((role) => role.name === "admin");

  return createUserSession({
    redirectTo: isAdmin ? "/admin" : "/employee",
    remember: data.remember,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{title: "Login"}];

export default function LoginPage() {
  const form = useRemixForm<Login>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <RemixFormProvider {...form}>
          <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-2">
            <div className="flex flex-col items-stretch space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <Input type="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <Input type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remember"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-start space-x-2">
                    <Checkbox {...form.register("remember")} />
                    <FormLabel className="text-white">Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button variant="secondary" className="w-full" type="submit">
              Submit
            </Button>

            <div className="text-end text-sm">
              Don't have an account?{" "}
              <Link className="text-blue-500 underline" to={{pathname: "/join"}}>
                Sign up
              </Link>
            </div>
          </Form>
        </RemixFormProvider>
      </div>
    </div>
  );
}
