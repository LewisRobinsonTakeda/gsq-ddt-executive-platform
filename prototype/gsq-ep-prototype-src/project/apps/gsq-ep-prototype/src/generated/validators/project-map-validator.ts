import { z } from 'zod';

/**
 * Zod schema for ProjectMap validation
 */
export const ProjectMapSchema = z.object({
  id: z.string().uuid(),
  projectMapName: z.string().min(1, { message: "Project Map Name is required" }),
  bigRock: z.object({ id: z.string().uuid(), bigRockName: z.string() }),
  mappingStatusKey: z.enum(['Draft', 'Validated', 'Approved', 'Archived']),
  project: z.object({ id: z.string().uuid(), projectName: z.string() }),
  roadmapYearBandKey: z.enum(['FY26BUILDFOUNDATION', 'FY27SCALEANDINTEGRATE', 'FY28TRANSFORM']),
  sequence: z.number().int(),
});

/**
 * Schema for creating a new ProjectMap (omits system-generated ID)
 */
export const CreateProjectMapSchema = ProjectMapSchema.omit({ id: true });

/**
 * Schema for updating an existing ProjectMap
 */
export const UpdateProjectMapSchema = ProjectMapSchema;

export type ProjectMapInput = z.infer<typeof ProjectMapSchema>;
export type CreateProjectMapInput = z.infer<typeof CreateProjectMapSchema>;
export type UpdateProjectMapInput = z.infer<typeof UpdateProjectMapSchema>;