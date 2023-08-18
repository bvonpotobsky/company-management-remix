import {NavLink, Outlet} from "@remix-run/react";

import {cn} from "~/utils";
import {buttonVariants} from "~/components/ui/button";

export default function AdminPageLayout() {
  return (
    <section className="relative flex flex-col justify-start overflow-hidden pb-16 pt-0">
      <div className="flex flex-col space-y-0.5 bg-background py-3">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="relative flex flex-col space-y-3 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="bg-background lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 overflow-y-auto lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

const sidebarNavItems = [
  {title: "Profile", href: "/employee/settings/profile"},
  {title: "Billing", href: "/employee/settings/billing"},
  {title: "Notifications", href: "/employee/settings/notifications"},
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({className, items, ...props}: SidebarNavProps) {
  return (
    <nav
      className={cn("mb-2 flex space-x-2 overflow-x-auto lg:mb-0 lg:flex-col lg:space-x-0 lg:space-y-1", className)}
      {...props}
    >
      <div
        className="flex space-x-4 lg:flex-col lg:space-x-0"
        style={{scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", scrollSnapAlign: "start"}}
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({isActive}) =>
              cn(
                buttonVariants({variant: "ghost"}),
                isActive ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                "flex-shrink-0 justify-start"
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
