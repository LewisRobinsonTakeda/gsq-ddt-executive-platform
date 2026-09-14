import { z } from 'zod';

/**
 * Zod schema for BudgetTracker validation
 */
export const BudgetTrackerSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  budgetId: z.string().optional(),
  capex: z.number().int().optional(),
  depreciation: z.number().int().optional(),
  fundingNote: z.string().optional(),
  fYKey: z.enum(['FY26', 'FY27', 'FY28']).optional(),
  localVsGlobal: z.string().optional(),
  opex: z.number().int().optional(),
  projectDescription: z.string().optional(),
  siteCode: z.string().optional(),
  siteLabel: z.string().optional(),
  spotId: z.string().optional(),
  valueCreation: z.string().optional(),
});

/**
 * Schema for creating a new BudgetTracker (omits system-generated ID)
 */
export const CreateBudgetTrackerSchema = BudgetTrackerSchema.omit({ id: true });

/**
 * Schema for updating an existing BudgetTracker
 */
export const UpdateBudgetTrackerSchema = BudgetTrackerSchema;

export type BudgetTrackerInput = z.infer<typeof BudgetTrackerSchema>;
export type CreateBudgetTrackerInput = z.infer<typeof CreateBudgetTrackerSchema>;
export type UpdateBudgetTrackerInput = z.infer<typeof UpdateBudgetTrackerSchema>;