import {Form, Link} from "@remix-run/react";

// import {useTheme} from "~/theme-provider";
// import {getNameInitials} from "~/helpers/index";
import {useUser} from "~/utils";

import {CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon} from "lucide-react";

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

import logo from "~/assets/everest-logo.png";

const UserHeader = () => {
  // const [theme, setTheme] = useTheme();

  return (
    <header className="border-b bg-background px-3 text-white">
      <nav className="flex h-14 w-full items-center justify-end gap-x-2">
        <Logo />
        {/* <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </Button> */}
        <UserMenu />
      </nav>
    </header>
  );
};

export default UserHeader;

const UserMenu = () => {
  const user = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={`Profile image of ${user?.name}`} />
            {/* <AvatarFallback>{getNameInitials(user?.name ?? "AA")}</AvatarFallback> */}
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="./settings/profile"
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="./settings/billing"
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="./settings/notifications"
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Form action="/logout" method="post">
            <button type="submit" className="flex w-full items-center justify-between">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ToDo: Make logo or something. Name???
// import {Acme} from "next/font/google";

export const Logo = () => {
  return (
    <Link to="/" className="mr-auto">
      <img src={logo} alt="Everest Facades Logo" width={60} height={45} />
    </Link>
  );
};
