import { z } from 'zod';

/**
 * Zod schema for Site validation
 */
export const SiteSchema = z.object({
  id: z.string().uuid(),
  name1: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  occupancyPercent: z.number().optional(),
  regionKey: z.enum(['NorthAmerica', 'LatinAmerica', 'APAC', 'Europe']),
  sortOrder: z.number().int(),
});

/**
 * Schema for creating a new Site (omits system-generated ID)
 */
export const CreateSiteSchema = SiteSchema.omit({ id: true });

/**
 * Schema for updating an existing Site
 */
export const UpdateSiteSchema = SiteSchema;

export type SiteInput = z.infer<typeof SiteSchema>;
export type CreateSiteInput = z.infer<typeof CreateSiteSchema>;
export type UpdateSiteInput = z.infer<typeof UpdateSiteSchema>;