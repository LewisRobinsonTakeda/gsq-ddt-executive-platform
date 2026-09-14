import { z } from 'zod';

/**
 * Zod schema for Capability validation
 */
export const CapabilitySchema = z.object({
  id: z.string().uuid(),
  capabilityName: z.string().min(1, { message: "Capability Name is required" }),
  capabilityStatusKey: z.enum(['NotStarted', 'InProgress', 'Established', 'NeedsAttention']),
  eDBDomain: z.string().min(1, { message: "EDB Domain is required" }),
  eDBIntegrationNeeded: z.boolean(),
  eDBSourceOwnerRoleKey: z.enum(['EnterpriseData', 'SiteDataLead', 'DigitalDelivery']),
  gapSummary: z.string().min(1, { message: "Gap Summary is required" }),
  maturityLevelKey: z.enum(['Initial', 'Developing', 'Defined', 'Managed', 'Optimized']),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
});

/**
 * Schema for creating a new Capability (omits system-generated ID)
 */
export const CreateCapabilitySchema = CapabilitySchema.omit({ id: true });

/**
 * Schema for updating an existing Capability
 */
export const UpdateCapabilitySchema = CapabilitySchema;

export type CapabilityInput = z.infer<typeof CapabilitySchema>;
export type CreateCapabilityInput = z.infer<typeof CreateCapabilitySchema>;
export type UpdateCapabilityInput = z.infer<typeof UpdateCapabilitySchema>;