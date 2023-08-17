import {Link} from "@remix-run/react";
import {type V2_MetaFunction} from "@remix-run/node";

import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {getNameInitials} from "~/helpers";

import {useOptionalUser} from "~/utils";

import logo from "~/assets/everest-logo.png";

export const meta: V2_MetaFunction = () => [{title: "Remix Notes"}];

export default function Index() {
  const user = useOptionalUser();

  const isAdmin = user && user.roles.map((role) => role.name).includes("admin");

  return (
    <main className="relative flex min-h-screen items-start justify-center bg-background md:items-center">
      <div className="relative pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <Link to="/" className="self-center">
                <img src={logo} alt="Everest Facades Logo" className="mb-14" width={340} height={255} />
              </Link>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <div className="flex max-w-7xl items-center justify-center border p-10">
                    <Link to={`${isAdmin ? "/admin" : "/employee"}`}>
                      <Avatar>
                        <AvatarImage src={undefined} alt={`Profile image of ${user?.name}`} />
                        <AvatarFallback>{getNameInitials(user?.name ?? "AA")}</AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="text-primery flex items-center justify-center rounded-sm border border-transparent bg-white px-4 py-3 text-base font-medium text-primary shadow-sm hover:bg-white/90 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-sm bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
