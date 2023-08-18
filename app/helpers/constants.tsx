import {Building, LayoutDashboard, Receipt, Settings, Users} from "lucide-react";

export type Route = (typeof ROUTES_ADMIN)[number];

export const ROUTES_ADMIN = [
  {href: "/admin", label: "Overview", icon: <LayoutDashboard />},
  {href: "/admin/projects", label: "Projects", icon: <Building />},
  {href: "/admin/employees", label: "Employees", icon: <Users />},
  {href: "/admin/invoices", label: "Invoices", icon: <Receipt />},
  {href: "/admin/settings/profile", label: "Employees", icon: <Settings />},
  // {href: "/admin/clients", label: "Clients", icon: <PersonStanding />},
];

export const ROUTES_EMPLOYEE = [
  {href: "/employee", label: "Overview", icon: <LayoutDashboard />},
  {href: "/employee/projects", label: "Projects", icon: <Building />},
  {href: "/employee/invoices", label: "Invoices", icon: <Receipt />},
  {href: "/employee/settings/profile", label: "Employees", icon: <Settings />},
];

export const COUNTRIES = [
  {id: "AU", name: "Australia"},
  {id: "NZ", name: "New Zealand"},
];
