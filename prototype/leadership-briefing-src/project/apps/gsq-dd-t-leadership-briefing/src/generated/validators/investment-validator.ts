import { z } from 'zod';

/**
 * Zod schema for Investment validation
 */
export const InvestmentSchema = z.object({
  id: z.string().uuid(),
  investmentName: z.string().min(1, { message: "Investment Name is required" }),
  approvedAmount: z.number(),
  currencyCode: z.string().min(1, { message: "Currency Code is required" }),
  fiscalYear: z.number().int(),
  forecastAmount: z.number(),
  investmentCategoryKey: z.enum(['Capital', 'Operating', 'Mixed']),
  portfolioInitiative: z.object({ id: z.string().uuid(), portfolioInitiativeName: z.string() }),
  statusKey: z.enum(['Planned', 'Approved', 'Committed', 'Spent']),
});

/**
 * Schema for creating a new Investment (omits system-generated ID)
 */
export const CreateInvestmentSchema = InvestmentSchema.omit({ id: true });

/**
 * Schema for updating an existing Investment
 */
export const UpdateInvestmentSchema = InvestmentSchema;

export type InvestmentInput = z.infer<typeof InvestmentSchema>;
export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof UpdateInvestmentSchema>;