import { z } from 'zod';

/**
 * Zod schema for CapabilityAssessment validation
 */
export const CapabilityAssessmentSchema = z.object({
  id: z.string().uuid(),
  capabilityAssessmentName: z.string().min(1, { message: "Capability Assessment Name is required" }),
  assessmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").min(1, { message: "Assessment Date is required" }),
  assessmentNote: z.string().optional(),
  capabilityDimensionKey: z.enum(['Process', 'Technology', 'Data', 'People', 'Governance']),
  digitalPlatform: z.object({ id: z.string().uuid(), digitalPlatformName: z.string() }),
  manufacturingSite: z.object({ id: z.string().uuid(), siteName: z.string() }),
  maturityLevelKey: z.enum(['Initial', 'Developing', 'Defined', 'Managed', 'Optimized']),
  score: z.number(),
});

/**
 * Schema for creating a new CapabilityAssessment (omits system-generated ID)
 */
export const CreateCapabilityAssessmentSchema = CapabilityAssessmentSchema.omit({ id: true });

/**
 * Schema for updating an existing CapabilityAssessment
 */
export const UpdateCapabilityAssessmentSchema = CapabilityAssessmentSchema;

export type CapabilityAssessmentInput = z.infer<typeof CapabilityAssessmentSchema>;
export type CreateCapabilityAssessmentInput = z.infer<typeof CreateCapabilityAssessmentSchema>;
export type UpdateCapabilityAssessmentInput = z.infer<typeof UpdateCapabilityAssessmentSchema>;