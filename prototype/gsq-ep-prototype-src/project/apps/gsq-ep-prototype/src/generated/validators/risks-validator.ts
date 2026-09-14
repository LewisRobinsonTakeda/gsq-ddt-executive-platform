import { z } from 'zod';

/**
 * Zod schema for Risks validation
 */
export const RisksSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  jiraKey: z.string().optional(),
  mitigation: z.string().optional(),
  ownerName: z.string().optional(),
  relatedSpotId: z.string().optional(),
  severity: z.string().optional(),
  siteCode: z.string().optional(),
  source: z.string().optional(),
  statusCanonical: z.string().optional(),
});

/**
 * Schema for creating a new Risks (omits system-generated ID)
 */
export const CreateRisksSchema = RisksSchema.omit({ id: true });

/**
 * Schema for updating an existing Risks
 */
export const UpdateRisksSchema = RisksSchema;

export type RisksInput = z.infer<typeof RisksSchema>;
export type CreateRisksInput = z.infer<typeof CreateRisksSchema>;
export type UpdateRisksInput = z.infer<typeof UpdateRisksSchema>;