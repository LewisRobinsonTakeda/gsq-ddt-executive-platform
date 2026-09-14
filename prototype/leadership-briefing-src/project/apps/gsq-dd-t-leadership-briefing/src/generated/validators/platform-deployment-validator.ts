import { z } from 'zod';

/**
 * Zod schema for PlatformDeployment validation
 */
export const PlatformDeploymentSchema = z.object({
  id: z.string().uuid(),
  platformDeploymentName: z.string().min(1, { message: "Platform Deployment Name is required" }),
  briefingNote: z.string().optional(),
  deploymentCode: z.string().min(1, { message: "Deployment Code is required" }),
  digitalPlatform: z.object({ id: z.string().uuid(), digitalPlatformName: z.string() }),
  manufacturingSite: z.object({ id: z.string().uuid(), siteName: z.string() }),
  statusKey: z.enum(['OnTrack', 'AtRisk', 'Delayed']),
  targetGoLiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
});

/**
 * Schema for creating a new PlatformDeployment (omits system-generated ID)
 */
export const CreatePlatformDeploymentSchema = PlatformDeploymentSchema.omit({ id: true });

/**
 * Schema for updating an existing PlatformDeployment
 */
export const UpdatePlatformDeploymentSchema = PlatformDeploymentSchema;

export type PlatformDeploymentInput = z.infer<typeof PlatformDeploymentSchema>;
export type CreatePlatformDeploymentInput = z.infer<typeof CreatePlatformDeploymentSchema>;
export type UpdatePlatformDeploymentInput = z.infer<typeof UpdatePlatformDeploymentSchema>;