import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {NavLink, Outlet} from "@remix-run/react";

import {requireUser} from "~/session.server";

import {ROUTES_EMPLOYEE, type Route} from "~/helpers/constants";
import {useWindowSize} from "~/hooks/use-window-size";
import UserHeader from "~/components/user-header";

export const loader = async ({request}: LoaderArgs) => {
  await requireUser(request);
  return json({});
};

export default function AdminRoute() {
  const windowSize = useWindowSize();

  return (
    <div className="flex h-[100dvh] flex-col">
      <UserHeader />
      <main className="flex h-full">
        <div className="flex-1 p-4">
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
    <div className="w-full border-t opacity-95">
      <nav className="mx-auto grid h-14 max-w-lg grid-flow-col font-medium" {...props}>
        {routes?.map((route) => (
          <NavLink
            key={route.href}
            to={route.href}
            className="group inline-flex h-full cursor-pointer flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {route.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
