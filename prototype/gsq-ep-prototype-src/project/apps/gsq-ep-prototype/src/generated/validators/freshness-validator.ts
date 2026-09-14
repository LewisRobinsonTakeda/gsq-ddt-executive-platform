import { z } from 'zod';

/**
 * Zod schema for Freshness validation
 */
export const FreshnessSchema = z.object({
  id: z.string().uuid(),
  freshnessRecordName: z.string().min(1, { message: "Freshness Record Name is required" }),
  dataDomain: z.string().min(1, { message: "Data Domain is required" }),
  freshnessStatusKey: z.enum(['Current', 'DueSoon', 'Stale', 'Unavailable']),
  integrationNeeded: z.boolean(),
  lastRefreshedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Last Refreshed Date is required" }),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
  sourceOwnerRoleKey: z.enum(['DigitalDelivery', 'SitePortfolio', 'EnterpriseData', 'ContentEditor']),
  sourceSystemKey: z.enum(['Jira', 'SPOT', 'EDB', 'SharePoint']),
});

/**
 * Schema for creating a new Freshness (omits system-generated ID)
 */
export const CreateFreshnessSchema = FreshnessSchema.omit({ id: true });

/**
 * Schema for updating an existing Freshness
 */
export const UpdateFreshnessSchema = FreshnessSchema;

export type FreshnessInput = z.infer<typeof FreshnessSchema>;
export type CreateFreshnessInput = z.infer<typeof CreateFreshnessSchema>;
export type UpdateFreshnessInput = z.infer<typeof UpdateFreshnessSchema>;