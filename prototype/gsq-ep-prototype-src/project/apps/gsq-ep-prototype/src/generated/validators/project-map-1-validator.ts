import { z } from 'zod';

/**
 * Zod schema for ProjectMap_1 validation
 */
export const ProjectMap_1Schema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  fiscalYear: z.string().optional(),
  jiraKey: z.string().optional(),
  rockId: z.string().optional(),
  siteCode: z.string().optional(),
});

/**
 * Schema for creating a new ProjectMap_1 (omits system-generated ID)
 */
export const CreateProjectMap_1Schema = ProjectMap_1Schema.omit({ id: true });

/**
 * Schema for updating an existing ProjectMap_1
 */
export const UpdateProjectMap_1Schema = ProjectMap_1Schema;

export type ProjectMap_1Input = z.infer<typeof ProjectMap_1Schema>;
export type CreateProjectMap_1Input = z.infer<typeof CreateProjectMap_1Schema>;
export type UpdateProjectMap_1Input = z.infer<typeof UpdateProjectMap_1Schema>;