import { z } from 'zod';

/**
 * Zod schema for FinancialClassification validation
 */
export const FinancialClassificationSchema = z.object({
  id: z.string().uuid(),
  financialClassificationName: z.string().min(1, { message: "Financial Classification Name is required" }),
  investmentClassificationKey: z.enum(['NonInvestmentOperational', 'Investment']),
  project: z.object({ id: z.string().uuid(), projectName: z.string() }),
  recordStatusKey: z.enum(['Draft', 'Validated', 'Approved', 'Archived']),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
  sPOTID: z.string().min(1, { message: "SPOT ID is required" }),
  sPOTIntegrationNeeded: z.boolean(),
  sPOTSourceOwnerRoleKey: z.enum(['SitePortfolio', 'FinanceGovernance', 'DigitalDelivery']),
});

/**
 * Schema for creating a new FinancialClassification (omits system-generated ID)
 */
export const CreateFinancialClassificationSchema = FinancialClassificationSchema.omit({ id: true });

/**
 * Schema for updating an existing FinancialClassification
 */
export const UpdateFinancialClassificationSchema = FinancialClassificationSchema;

export type FinancialClassificationInput = z.infer<typeof FinancialClassificationSchema>;
export type CreateFinancialClassificationInput = z.infer<typeof CreateFinancialClassificationSchema>;
export type UpdateFinancialClassificationInput = z.infer<typeof UpdateFinancialClassificationSchema>;