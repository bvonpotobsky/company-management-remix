import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {NavLink, Outlet} from "@remix-run/react";

import {requireAdmin} from "~/session.server";

import {useWindowSize} from "~/hooks/use-window-size";
import {ROUTES_ADMIN, type Route} from "~/helpers/constants";

import UserHeader from "~/components/user-header";

export const loader = async ({request}: LoaderArgs) => {
  await requireAdmin(request);
  return json({});
};

export default function AdminPage() {
  const windowSize = useWindowSize();

  return (
    <div className="flex h-[100dvh] flex-col">
      <UserHeader />
      <main className="flex h-full overflow-y-auto">
        <div className="flex-1 p-4 pt-0">
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
    <div className="mt-2 w-full border-t opacity-95">
      <nav className="mx-auto grid h-14 max-w-lg grid-flow-col font-medium" {...props}>
        {routes.map((route) => (
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
