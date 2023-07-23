import {Link} from "@remix-run/react";

import {buttonVariants} from "./ui/button";
import {ChevronLeft} from "lucide-react";

// ToDo: Learn to create type with literal string

const GoBackURL = ({to}: {to: string}) => {
  return (
    <Link to={to} className={buttonVariants({variant: "ghost", className: "flex items-center font-bold"})}>
      <ChevronLeft className="mr-1" size={20} /> Go back
    </Link>
  );
};

export default GoBackURL;
