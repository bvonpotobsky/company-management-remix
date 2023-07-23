import {cssBundleHref} from "@remix-run/css-bundle";
import type {LinksFunction, LoaderArgs, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";

import {getUser} from "~/session.server";
import stylesheet from "~/tailwind.css";
import {ThemeProvider, useTheme} from "~/theme-provider";
import {cn} from "~/utils";

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: stylesheet},
  ...(cssBundleHref ? [{rel: "stylesheet", href: cssBundleHref}] : []),
];

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
  return json<LoaderData>({user: await getUser(request)});
};

function App() {
  const [theme] = useTheme();

  return (
    <html lang="en" className={cn(theme, "h-full")}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
