import { z } from 'zod';

/**
 * Zod schema for IntegrationsTracker validation
 */
export const IntegrationsTrackerSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actualGoLive: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  adoptPct: z.number().int().optional(),
  adoptStatus: z.string().optional(),
  blockerNotes: z.string().optional(),
  deployPct: z.number().int().optional(),
  deployStatus: z.string().optional(),
  domainPair: z.string().optional(),
  integrationId: z.string().optional(),
  manualStatus: z.string().optional(),
  plant: z.string().optional(),
  productGroup: z.string().optional(),
  productLine: z.string().optional(),
  requiredWork: z.string().optional(),
  scopeType: z.string().optional(),
  siteCode: z.string().optional(),
  spotId: z.string().optional(),
  status1Key: z.enum(['NotPlanned', 'NotStarted', 'InProgress', 'Live', 'Validated', 'Adopted', 'Deployed', 'Active']).optional(),
  statusKey: z.enum(['NotPlanned', 'NotStarted', 'InProgress', 'Live', 'Validated', 'Adopted', 'Deployed', 'Active']).optional(),
  targetGoLive: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  transcribePct: z.number().int().optional(),
});

/**
 * Schema for creating a new IntegrationsTracker (omits system-generated ID)
 */
export const CreateIntegrationsTrackerSchema = IntegrationsTrackerSchema.omit({ id: true });

/**
 * Schema for updating an existing IntegrationsTracker
 */
export const UpdateIntegrationsTrackerSchema = IntegrationsTrackerSchema;

export type IntegrationsTrackerInput = z.infer<typeof IntegrationsTrackerSchema>;
export type CreateIntegrationsTrackerInput = z.infer<typeof CreateIntegrationsTrackerSchema>;
export type UpdateIntegrationsTrackerInput = z.infer<typeof UpdateIntegrationsTrackerSchema>;