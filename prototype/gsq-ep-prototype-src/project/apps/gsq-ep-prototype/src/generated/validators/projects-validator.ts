import { z } from 'zod';

/**
 * Zod schema for Projects validation
 */
export const ProjectsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  businessValue: z.string().optional(),
  dependencies: z.string().optional(),
  description: z.string().optional(),
  finishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  initiativeKey: z.string().optional(),
  initiativeName: z.string().optional(),
  jiraKey: z.string().optional(),
  jiraUrlText: z.string().optional(),
  ownerName: z.string().optional(),
  platform: z.string().optional(),
  programmeOrLocal: z.string().optional(),
  progressPct: z.number().int().optional(),
  siteCode: z.string().optional(),
  spotId: z.string().optional(),
  spotUrlText: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  statusCanonical: z.string().optional(),
});

/**
 * Schema for creating a new Projects (omits system-generated ID)
 */
export const CreateProjectsSchema = ProjectsSchema.omit({ id: true });

/**
 * Schema for updating an existing Projects
 */
export const UpdateProjectsSchema = ProjectsSchema;

export type ProjectsInput = z.infer<typeof ProjectsSchema>;
export type CreateProjectsInput = z.infer<typeof CreateProjectsSchema>;
export type UpdateProjectsInput = z.infer<typeof UpdateProjectsSchema>;