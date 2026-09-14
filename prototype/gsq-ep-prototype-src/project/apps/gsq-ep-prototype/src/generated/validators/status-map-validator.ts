import { z } from 'zod';

/**
 * Zod schema for StatusMap validation
 */
export const StatusMapSchema = z.object({
  id: z.string().uuid(),
  statusMapName: z.string().min(1, { message: "Status Map Name is required" }),
  bigRock: z.object({ id: z.string().uuid(), bigRockName: z.string() }),
  executiveStatusKey: z.enum(['NotStarted', 'OnTrack', 'AtRisk', 'OffTrack', 'Completed']),
  roadmapYearBandKey: z.enum(['FY26BUILDFOUNDATION', 'FY27SCALEANDINTEGRATE', 'FY28TRANSFORM']),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
  statusSummary: z.string().min(1, { message: "Status Summary is required" }),
  updatedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Updated Date is required" }),
});

/**
 * Schema for creating a new StatusMap (omits system-generated ID)
 */
export const CreateStatusMapSchema = StatusMapSchema.omit({ id: true });

/**
 * Schema for updating an existing StatusMap
 */
export const UpdateStatusMapSchema = StatusMapSchema;

export type StatusMapInput = z.infer<typeof StatusMapSchema>;
export type CreateStatusMapInput = z.infer<typeof CreateStatusMapSchema>;
export type UpdateStatusMapInput = z.infer<typeof UpdateStatusMapSchema>;