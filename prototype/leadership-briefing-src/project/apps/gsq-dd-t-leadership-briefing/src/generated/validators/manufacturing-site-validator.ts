import { z } from 'zod';

/**
 * Zod schema for ManufacturingSite validation
 */
export const ManufacturingSiteSchema = z.object({
  id: z.string().uuid(),
  siteName: z.string().min(1, { message: "Site Name is required" }),
  briefingSequence: z.number().int(),
  country: z.string().min(1, { message: "Country is required" }),
  regionKey: z.enum(['Americas', 'Europe', 'AsiaPacific']),
  siteCode: z.string().min(1, { message: "Site Code is required" }),
});

/**
 * Schema for creating a new ManufacturingSite (omits system-generated ID)
 */
export const CreateManufacturingSiteSchema = ManufacturingSiteSchema.omit({ id: true });

/**
 * Schema for updating an existing ManufacturingSite
 */
export const UpdateManufacturingSiteSchema = ManufacturingSiteSchema;

export type ManufacturingSiteInput = z.infer<typeof ManufacturingSiteSchema>;
export type CreateManufacturingSiteInput = z.infer<typeof CreateManufacturingSiteSchema>;
export type UpdateManufacturingSiteInput = z.infer<typeof UpdateManufacturingSiteSchema>;