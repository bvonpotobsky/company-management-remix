import type {LoaderFunction, SerializeFrom} from "@remix-run/node";
import {json} from "@remix-run/node";

import {Form, useLoaderData} from "@remix-run/react";

import {RemixFormProvider, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import * as z from "zod";

import {requireUser} from "~/session.server";
import type {getUserById} from "~/models/user.server";

import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Separator} from "~/components/ui/separator";

type Loader = {
  user: SerializeFrom<typeof getUserById>;
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await requireUser(request);

  return json<Loader>({user});
};

export default function AdminProfileRoute() {
  const {user} = useLoaderData<Loader>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </section>
  );
}

const updateProfileSchema = z.object({
  name: z.string().min(2, "Your name must be at least 2 characters long."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

// This can come from your database or API.

const ProfileForm: React.FC<{user: Awaited<ReturnType<typeof getUserById>>}> = ({user}) => {
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  };

  const form = useRemixForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Galt" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Insert your phone number" {...field} type="tel" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </Form>
    </RemixFormProvider>
  );
};
