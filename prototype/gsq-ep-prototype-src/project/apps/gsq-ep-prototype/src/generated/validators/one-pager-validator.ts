import { z } from 'zod';

/**
 * Zod schema for OnePager validation
 */
export const OnePagerSchema = z.object({
  id: z.number().int(),
  description: z.string().min(1, { message: "Description is required" }),
  bigRockKey: z.enum(['OneDayBatchRelease', 'LabOfTheFuture', 'PredictiveMaintenance', 'RapidDigitalTechTransfer', 'InventoryOptimization', 'PowerOfDigitalTwins']),
  fiscalYearKey: z.enum(['FY2026', 'FY2027', 'FY2028']),
  jira: z.string().optional(),
  northStarKey: z.enum(['MES', 'LIMS', 'SAP', 'Takami', 'SAIL', 'LPMS', 'APMS', 'RTMS', 'COMOS', 'SmartQC', 'LabX', 'VeevaEQMS', 'Discoverant', 'OptTracker', 'SIMCAOnline', 'OpsTrakker', 'Phoenix', 'Fabriq', 'Labware']),
  sequence: z.number().int().optional(),
  siteKey: z.enum(['THOThousandOaks', 'LEXLexington', 'BRPBrooklynPark', 'NAUNaucalpan', 'BUEBuenosAires', 'TJNTianjin', 'OSAOsaka', 'HIKHikari', 'SGPSingapore', 'YARYaroslavl', 'BEKBekasi', 'GRAGrangeCastle', 'BRYBray', 'LINLinz', 'ORAOranienburg', 'SNGSingen', 'NEUNeuchatel', 'VASVashi']),
  sPOT: z.string().optional(),
  statusKey: z.enum(['OnTrack', 'Started', 'AtRisk', 'Delayed']),
});

/**
 * Schema for creating a new OnePager (omits system-generated ID)
 */
export const CreateOnePagerSchema = OnePagerSchema.omit({ id: true });

/**
 * Schema for updating an existing OnePager
 */
export const UpdateOnePagerSchema = OnePagerSchema;

export type OnePagerInput = z.infer<typeof OnePagerSchema>;
export type CreateOnePagerInput = z.infer<typeof CreateOnePagerSchema>;
export type UpdateOnePagerInput = z.infer<typeof UpdateOnePagerSchema>;