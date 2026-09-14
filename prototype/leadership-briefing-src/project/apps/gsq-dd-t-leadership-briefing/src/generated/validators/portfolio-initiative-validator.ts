import { z } from 'zod';

/**
 * Zod schema for PortfolioInitiative validation
 */
export const PortfolioInitiativeSchema = z.object({
  id: z.string().uuid(),
  portfolioInitiativeName: z.string().min(1, { message: "Portfolio Initiative Name is required" }),
  digitalPlatform: z.object({ id: z.string().uuid(), digitalPlatformName: z.string() }),
  executiveSummary: z.string().optional(),
  goldenThread: z.string().optional(),
  initiativeCode: z.string().min(1, { message: "Initiative Code is required" }),
  manufacturingSite: z.object({ id: z.string().uuid(), siteName: z.string() }),
  sPOTNumber: z.string().optional(),
  statusKey: z.enum(['OnTrack', 'AtRisk', 'Delayed']),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
});

/**
 * Schema for creating a new PortfolioInitiative (omits system-generated ID)
 */
export const CreatePortfolioInitiativeSchema = PortfolioInitiativeSchema.omit({ id: true });

/**
 * Schema for updating an existing PortfolioInitiative
 */
export const UpdatePortfolioInitiativeSchema = PortfolioInitiativeSchema;

export type PortfolioInitiativeInput = z.infer<typeof PortfolioInitiativeSchema>;
export type CreatePortfolioInitiativeInput = z.infer<typeof CreatePortfolioInitiativeSchema>;
export type UpdatePortfolioInitiativeInput = z.infer<typeof UpdatePortfolioInitiativeSchema>;