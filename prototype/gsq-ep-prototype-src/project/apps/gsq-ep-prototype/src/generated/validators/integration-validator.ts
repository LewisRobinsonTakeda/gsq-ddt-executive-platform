import { z } from 'zod';

/**
 * Zod schema for Integration validation
 */
export const IntegrationSchema = z.object({
  id: z.string().uuid(),
  integrationName: z.string().min(1, { message: "Integration Name is required" }),
  dataDomain: z.string().min(1, { message: "Data Domain is required" }),
  integrationNeeded: z.boolean(),
  integrationStatusKey: z.enum(['NotPlanned', 'Planned', 'InProgress', 'Connected', 'Blocked']),
  ownershipNotes: z.string().optional(),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
  sourceOwnerRoleKey: z.enum(['DigitalDelivery', 'SitePortfolio', 'EnterpriseData']),
  sourceSystemKey: z.enum(['Jira', 'SPOT', 'EDB']),
});

/**
 * Schema for creating a new Integration (omits system-generated ID)
 */
export const CreateIntegrationSchema = IntegrationSchema.omit({ id: true });

/**
 * Schema for updating an existing Integration
 */
export const UpdateIntegrationSchema = IntegrationSchema;

export type IntegrationInput = z.infer<typeof IntegrationSchema>;
export type CreateIntegrationInput = z.infer<typeof CreateIntegrationSchema>;
export type UpdateIntegrationInput = z.infer<typeof UpdateIntegrationSchema>;