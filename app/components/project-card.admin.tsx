import type {SerializeFrom} from "@remix-run/node";
import {Link} from "@remix-run/react";

import type {getAllProjectsWithMembers} from "~/models/project.server";

import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {Building, MapPin, MoreHorizontal} from "lucide-react";
// import AddMemberToProjectForm from "~/components/create-project-member-form";

type Project = SerializeFrom<typeof getAllProjectsWithMembers>[number];

const ProjectCardAdmin: React.FC<{project: Project}> = ({project}) => {
  //   const avatars = project..map((member) => {
  //     return {
  //       id: member.id,
  //       image: member.user.firstName,
  //       name: `${member.user.firstName} ${member.user.lastName}`,
  //     };
  //   });

  return (
    <Card className="mb-4 last:mb-0">
      <CardHeader className="flex w-full flex-row items-center justify-start gap-x-3 border-b p-3">
        <Building className="ml-1 h-7 w-7 text-muted-foreground" />
        <CardTitle className="text-xl font-semibold tracking-wide first-letter:uppercase">{project.name}</CardTitle>
        <Badge className="rounded-sm hover:bg-primary">{project.status}</Badge>
        <ProjectOptions projectId={project.id} />
      </CardHeader>

      <CardContent className="flex flex-col gap-y-2 p-4">
        <CardDescription className="flex items-center gap-x-2">
          <MapPin />
          {project.address.street}, {project.address.city}
        </CardDescription>
        <CardDescription className="text-sm text-gray-500">
          {/* {projectManagers.map((manager) => manager.profile.firstName).join(", ")} */}
        </CardDescription>

        <CardFooter className="flex flex-row justify-start p-0">
          <section className="flex -space-x-6 overflow-hidden">
            {/* {false && avatars.map((avatar) => (
              <div key={avatar.id} className="border-base-100 overflow-hidden rounded-full border-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar.image ?? undefined} alt={`Profile image of ${avatar.name}`} />
                  <AvatarFallback>{getNameInitials(avatar.name)}</AvatarFallback>
                </Avatar>
              </div>
            ))} */}
          </section>

          <Button variant="secondary" asChild>
            <Link to={`./projects/${project.id}`} className="ml-auto flex items-center">
              View
            </Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ProjectCardAdmin;

const ProjectOptions: React.FC<{projectId: string}> = ({projectId}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-auto">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start" forceMount>
        <DropdownMenuItem className="cursor-pointer">Edit project</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to={`/admin/projects/${projectId}`}>Add member</Link>
          {/* <AddMemberToProjectForm
            projectId={projectId}
            trigger={
              <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Add member
              </button>
            }
          /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500">Delete project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
