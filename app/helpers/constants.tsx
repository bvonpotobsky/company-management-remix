import {Building, LayoutDashboard, Receipt, Users} from "lucide-react";

export type Route = (typeof ROUTES_ADMIN)[number];

export const ROUTES_ADMIN = [
  {href: "/admin", label: "Overview", icon: <LayoutDashboard />},
  {href: "/admin/invoices", label: "Invoices", icon: <Receipt />},
  {href: "/admin/projects", label: "Projects", icon: <Building />},
  {href: "/admin/employees", label: "Employees", icon: <Users />},
  // {href: "/admin/clients", label: "Clients", icon: <PersonStanding />},
];

export const ROUTES_EMPLOYEE = [
  {href: "/employee", label: "Overview", icon: <LayoutDashboard />},
  {href: "/employee/invoices", label: "Invoices", icon: <Receipt />},
  {href: "/employee/profile", label: "Employees", icon: <Users />},
];

export const COUNTRIES = [
  {id: "AU", name: "Australia"},
  {id: "NZ", name: "New Zealand"},
];
