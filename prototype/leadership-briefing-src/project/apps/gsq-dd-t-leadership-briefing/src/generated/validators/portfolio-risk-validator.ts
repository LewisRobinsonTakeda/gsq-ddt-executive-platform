import { z } from 'zod';

/**
 * Zod schema for PortfolioRisk validation
 */
export const PortfolioRiskSchema = z.object({
  id: z.string().uuid(),
  riskName: z.string().min(1, { message: "Risk Name is required" }),
  closedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  impactKey: z.enum(['Low', 'Medium', 'High']),
  likelihoodKey: z.enum(['Low', 'Medium', 'High']),
  mitigationSummary: z.string().min(1, { message: "Mitigation Summary is required" }),
  portfolioInitiative: z.object({ id: z.string().uuid(), portfolioInitiativeName: z.string() }),
  riskScore: z.number().int(),
  statusKey: z.enum(['Open', 'Monitoring', 'Mitigated', 'Closed']),
  targetResolutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
});

/**
 * Schema for creating a new PortfolioRisk (omits system-generated ID)
 */
export const CreatePortfolioRiskSchema = PortfolioRiskSchema.omit({ id: true });

/**
 * Schema for updating an existing PortfolioRisk
 */
export const UpdatePortfolioRiskSchema = PortfolioRiskSchema;

export type PortfolioRiskInput = z.infer<typeof PortfolioRiskSchema>;
export type CreatePortfolioRiskInput = z.infer<typeof CreatePortfolioRiskSchema>;
export type UpdatePortfolioRiskInput = z.infer<typeof UpdatePortfolioRiskSchema>;