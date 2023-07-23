import type {SerializeFrom} from "@remix-run/node";
import {Link} from "@remix-run/react";

import type {getAllProjectsByUserId} from "~/models/project.server";

import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";

import {Building, MapPin} from "lucide-react";

type Project = SerializeFrom<typeof getAllProjectsByUserId>[number];

const ProjectCardEmployee: React.FC<{project: Project}> = ({project}) => {
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
        <Badge className="ml-auto rounded-sm hover:bg-primary">{project.status}</Badge>
        {/* <ProjectOptions projectId={project.id} /> { Here we could add a features like: add to favs, etc } */}
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
            <Link to={`/employee/projects/${project.id}`} className="ml-auto flex items-center">
              View
            </Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ProjectCardEmployee;
