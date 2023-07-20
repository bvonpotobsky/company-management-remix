import {z} from "zod";

export const NewProjectSchema = z
  .object({
    name: z.string(),
    startDate: z.date(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
  })
  .required();

export type NewProject = z.infer<typeof NewProjectSchema>;
