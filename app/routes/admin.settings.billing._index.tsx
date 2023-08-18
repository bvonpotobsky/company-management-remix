import {Form, useLoaderData} from "@remix-run/react";

import {RemixFormProvider, getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Separator} from "~/components/ui/separator";

import type {ActionArgs, ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import type {UpdateBilling} from "~/models/billing.server";
import {UpdateBillingSchema, getBillingByUserId, updateOrCreateBillingByUserId} from "~/models/billing.server";

const resolver = zodResolver(UpdateBillingSchema);

type Loader = {
  billing: Awaited<ReturnType<typeof getBillingByUserId>>;
};

export const loader: LoaderFunction = async ({request}) => {
  const userId = await requireUserId(request);
  const billing = await getBillingByUserId({id: userId});

  return json<Loader>({billing});
};

export const action: ActionFunction = async ({request}: ActionArgs) => {
  const userId = await requireUserId(request);

  const {data, errors} = await getValidatedFormData<UpdateBilling>(request, resolver);

  if (errors) return json({errors});

  // ToDo: Check best way to handle this.
  await updateOrCreateBillingByUserId({userId, data});

  return redirect("/admin/settings/billing");
};

export default function AdminProfileRoute() {
  const {billing} = useLoaderData<Loader>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">Manage your bank account and billing information.</p>
      </div>
      <Separator />
      <ProfileForm billing={billing} />
    </section>
  );
}

const ProfileForm: React.FC<{billing: Loader["billing"]}> = ({billing}) => {
  // This can come from your database or API.
  const defaultValues: Partial<UpdateBilling> = {
    abn: billing?.abn ?? "",
    tfn: billing?.tfn ?? "",
    bankName: billing?.bankAccount?.bankName ?? "",
    accountNumber: billing?.bankAccount?.accountNumber ?? "",
    bsb: billing?.bankAccount?.bsb ?? "",
  };

  const form = useRemixForm<UpdateBilling>({
    defaultValues,
    mode: "onChange",
  });

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="bankName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Commonwealth Bank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bsb"
          render={({field}) => (
            <FormItem>
              <FormLabel>BSB</FormLabel>
              <FormControl>
                <Input placeholder="124 213" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abn"
          render={({field}) => (
            <FormItem>
              <FormLabel>ABN</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tfn"
          render={({field}) => (
            <FormItem>
              <FormLabel>TFN</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678" {...field} />
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
