import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Link, Outlet} from "@remix-run/react";

import {requireUser} from "~/session.server";

import {ROUTES_EMPLOYEE, type Route} from "~/helpers/constants";
import {useWindowSize} from "~/hooks/use-window-size";

import UserHeader from "~/components/user-header";

export const loader = async ({request}: LoaderArgs) => {
  await requireUser(request);
  return json({});
};

export default function EmployeeRouteLayout() {
  const windowSize = useWindowSize();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <UserHeader />
      <main className="flex h-full">
        {/* pb-14: navbar bottom */}
        <div className="flex-1 overflow-y-auto p-4 pb-14 pt-0">
          <Outlet />
        </div>
      </main>
      {windowSize === "mobile" && <NavbarMobile routes={ROUTES_EMPLOYEE} />}
    </div>
  );
}

const NavbarMobile: React.FC<{
  routes: Route[] & React.HTMLAttributes<HTMLDivElement>;
}> = ({routes, ...props}) => {
  return (
    <div className="absolute bottom-0 h-14 w-full border-t bg-background">
      <nav className="mx-auto grid h-14 max-w-lg grid-flow-col font-medium" {...props}>
        {routes?.map((route) => (
          <Link key={route.href} to={route.href} className="flex flex-col items-center justify-center">
            {route.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
};
