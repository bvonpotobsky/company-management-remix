import type {ActionArgs, LoaderArgs, V2_MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";
import {zodResolver} from "@hookform/resolvers/zod";

import {verifyLogin} from "~/models/user.server";
import {createUserSession, getUserId} from "~/session.server";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";

import {type Login, LoginSchema} from "~/models/user.server";

import {Input} from "~/components/ui/input";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "~/components/ui/button";
import {Checkbox} from "~/components/ui/checkbox";

const resolver = zodResolver(LoginSchema);

export const loader = async ({request}: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({request}: ActionArgs) => {
  const {data, errors, receivedValues} = await getValidatedFormData<Login>(request, resolver);

  console.log({data, errors, receivedValues});

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
    redirectTo: isAdmin ? "/admin" : "/",
    remember: true,
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
    resolver,
  });

  const errors = form.formState.errors;

  console.log({errors});

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-2">
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Password:</Label>
            <Input type="password" {...form.register("password")} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div className="flex items-center justify-start space-x-2">
            <Checkbox {...form.register("remember")} />
            <Label className="w-full">Remember me</Label>
          </div>

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
      </div>
    </div>
  );
}
