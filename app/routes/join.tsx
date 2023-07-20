import type {ActionArgs, LoaderArgs, V2_MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";
import {zodResolver} from "@hookform/resolvers/zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";

import type {NewUser} from "~/models/user.schema";
import {NewUserSchema} from "~/models/user.schema";

import {createUser, getUserByEmail} from "~/models/user.server";
import {createUserSession, getUserId} from "~/session.server";

import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";

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

  const errors = form.formState.errors;

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form onSubmit={form.handleSubmit} className="last:mb-0 [&>*]:mb-3">
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Full Name:</Label>
            <Input type="text" {...form.register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Date of Birth:</Label>
            <Input type="datetime-local" {...form.register("dob", {valueAsDate: true})} />
            {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
          </div>
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Phone:</Label>
            <Input type="tel" {...form.register("phone")} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="flex flex-col items-stretch space-y-2">
            <Label>Email:</Label>
          </div>
          <div className="flex flex-col items-stretch space-y-2">
            <Input type="email" {...form.register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            <Label>Password:</Label>
          </div>
          <div className="flex flex-col items-stretch space-y-2">
            <Input type="password" {...form.register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link className="text-blue-500 underline" to={{pathname: "/login"}}>
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
