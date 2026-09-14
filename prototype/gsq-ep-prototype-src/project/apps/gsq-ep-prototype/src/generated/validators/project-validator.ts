import { z } from 'zod';

/**
 * Zod schema for Project validation
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  projectName: z.string().min(1, { message: "Project Name is required" }),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Created Date is required" }),
  eDBDomain: z.string().optional(),
  eDBIntegrationNeeded: z.boolean(),
  eDBSourceOwnerRoleKey: z.enum(['DigitalDelivery', 'SitePortfolio', 'EnterpriseData', 'NotApplicable']),
  jiraIntegrationNeeded: z.boolean(),
  jiraKey: z.string().optional(),
  jiraSourceOwnerRoleKey: z.enum(['DigitalDelivery', 'SitePortfolio', 'EnterpriseData', 'NotApplicable']),
  roadmapStatusKey: z.enum(['Proposed', 'Planned', 'Active', 'OnHold', 'Completed']),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
  sPOTID: z.string().optional(),
  sPOTIntegrationNeeded: z.boolean(),
  sPOTSourceOwnerRoleKey: z.enum(['DigitalDelivery', 'SitePortfolio', 'EnterpriseData', 'NotApplicable']),
});

/**
 * Schema for creating a new Project (omits system-generated ID)
 */
export const CreateProjectSchema = ProjectSchema.omit({ id: true });

/**
 * Schema for updating an existing Project
 */
export const UpdateProjectSchema = ProjectSchema;

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;