import { z } from 'zod';

/**
 * Zod schema for Financials validation
 */
export const FinancialsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actual: z.number().optional(),
  approved: z.number().optional(),
  asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  forecast: z.number().optional(),
  fY: z.string().optional(),
  integrationNeeded: z.boolean().optional(),
  jiraKey: z.string().optional(),
  siteCode: z.string().optional(),
  spotId: z.string().optional(),
});

/**
 * Schema for creating a new Financials (omits system-generated ID)
 */
export const CreateFinancialsSchema = FinancialsSchema.omit({ id: true });

/**
 * Schema for updating an existing Financials
 */
export const UpdateFinancialsSchema = FinancialsSchema;

export type FinancialsInput = z.infer<typeof FinancialsSchema>;
export type CreateFinancialsInput = z.infer<typeof CreateFinancialsSchema>;
export type UpdateFinancialsInput = z.infer<typeof UpdateFinancialsSchema>;