import { z } from 'zod';

/**
 * Zod schema for CapabilityTracker validation
 */
export const CapabilityTrackerSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  adoptPct: z.number().int().optional(),
  blockerCategory: z.string().optional(),
  blockerDesc: z.string().optional(),
  capabilityId: z.string().optional(),
  deployPct: z.number().int().optional(),
  functionName: z.string().optional(),
  intAdoptPct: z.number().int().optional(),
  intDeployPct: z.number().int().optional(),
  intTranscribePct: z.number().int().optional(),
  missingInts: z.string().optional(),
  ownerName: z.string().optional(),
  plant: z.string().optional(),
  platform: z.string().optional(),
  programName: z.string().optional(),
  region: z.string().optional(),
  reqIntCount: z.number().int().optional(),
  reqIntIds: z.string().optional(),
  scopeType: z.string().optional(),
  scopeValue: z.string().optional(),
  siteCode: z.string().optional(),
  spotId: z.string().optional(),
  targetQuarter: z.string().optional(),
  transcribePct: z.number().int().optional(),
});

/**
 * Schema for creating a new CapabilityTracker (omits system-generated ID)
 */
export const CreateCapabilityTrackerSchema = CapabilityTrackerSchema.omit({ id: true });

/**
 * Schema for updating an existing CapabilityTracker
 */
export const UpdateCapabilityTrackerSchema = CapabilityTrackerSchema;

export type CapabilityTrackerInput = z.infer<typeof CapabilityTrackerSchema>;
export type CreateCapabilityTrackerInput = z.infer<typeof CreateCapabilityTrackerSchema>;
export type UpdateCapabilityTrackerInput = z.infer<typeof UpdateCapabilityTrackerSchema>;