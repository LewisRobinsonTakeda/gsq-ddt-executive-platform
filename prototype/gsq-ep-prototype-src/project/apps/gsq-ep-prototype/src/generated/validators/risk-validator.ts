import { z } from 'zod';

/**
 * Zod schema for Risk validation
 */
export const RiskSchema = z.object({
  id: z.string().uuid(),
  riskName: z.string().min(1, { message: "Risk Name is required" }),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Created Date is required" }),
  entrySourceKey: z.enum(['SharePoint']),
  likelihoodKey: z.enum(['Unlikely', 'Possible', 'Likely', 'AlmostCertain']),
  project: z.object({ id: z.string().uuid(), projectName: z.string() }).optional(),
  reviewComments: z.string().optional(),
  reviewedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  riskDescription: z.string().min(1, { message: "Risk Description is required" }),
  riskStatusKey: z.enum(['Draft', 'InReview', 'Accepted', 'Mitigating', 'Closed']),
  severityKey: z.enum(['Low', 'Medium', 'High', 'Critical']),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
});

/**
 * Schema for creating a new Risk (omits system-generated ID)
 */
export const CreateRiskSchema = RiskSchema.omit({ id: true });

/**
 * Schema for updating an existing Risk
 */
export const UpdateRiskSchema = RiskSchema;

export type RiskInput = z.infer<typeof RiskSchema>;
export type CreateRiskInput = z.infer<typeof CreateRiskSchema>;
export type UpdateRiskInput = z.infer<typeof UpdateRiskSchema>;