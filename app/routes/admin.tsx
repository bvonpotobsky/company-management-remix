import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Link, Outlet} from "@remix-run/react";

import {requireAdmin} from "~/session.server";

import {useWindowSize} from "~/hooks/use-window-size";
import {ROUTES_ADMIN, type Route} from "~/helpers/constants";

import UserHeader from "~/components/user-header";

export const loader = async ({request}: LoaderArgs) => {
  await requireAdmin(request);
  return json({});
};

export default function AdminPageLayout() {
  const windowSize = useWindowSize();

  return (
    <div className="flex h-[100dvh] flex-col">
      <UserHeader />
      <main className="flex h-full overflow-y-auto">
        <div className="mb-4 flex-1 overflow-y-auto px-4">
          <Outlet />
        </div>
      </main>
      {windowSize === "mobile" && <NavbarMobile routes={ROUTES_ADMIN} />}
    </div>
  );
}

const NavbarMobile: React.FC<{
  routes: Route[] & React.HTMLAttributes<HTMLDivElement>;
}> = ({routes, ...props}) => {
  return (
    <div className="absolute bottom-0 h-14 w-full border-t bg-background">
      <nav className="mx-auto grid h-14 max-w-lg grid-flow-col font-medium" {...props}>
        {routes.map((route) => (
          <Link key={route.href} to={route.href} className="flex flex-col items-center justify-center">
            {route.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
};
