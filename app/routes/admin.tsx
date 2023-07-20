import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {NavLink, Outlet} from "@remix-run/react";

import {useWindowSize} from "~/hooks/use-window-size";
import {useTheme} from "~/theme-provider";
import {getNameInitials} from "~/helpers/index";

import {useUser} from "~/utils";
// import {requireUserAdmin} from "~/session.server";

import {ROUTES_ADMIN, type Route} from "~/helpers/constants";

import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {Button} from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {CreditCardIcon, LogOutIcon, MoonIcon, PlusCircleIcon, SettingsIcon, SunIcon, UserIcon} from "lucide-react";
import {requireAdmin} from "~/session.server";

export const loader = async ({request}: LoaderArgs) => {
  await requireAdmin(request);
  return json({});
};

export default function AdminPage() {
  const [theme, setTheme] = useTheme();

  const windowSize = useWindowSize();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-3 text-white">
        <nav className="w-full">
          <section className="flex w-full items-center justify-end space-x-3">
            <Logo />
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <UserMenu />
          </section>
        </nav>
      </header>

      <main className="flex h-full">
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
      {windowSize === "mobile" && <NavbarMobile routes={ROUTES_ADMIN} />}
    </div>
  );
}

// ToDo: Make logo or something. Name???
// import {Acme} from "next/font/google";

export const Logo = () => {
  return <h1 className="mr-auto text-black dark:text-white">IMK</h1>;
};

const UserMenu = () => {
  const user = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={`Profile image of ${user.name}`} />
            <AvatarFallback>{getNameInitials(user.name ?? "AA")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {/* <Link href="/admin/profile"> */}
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
