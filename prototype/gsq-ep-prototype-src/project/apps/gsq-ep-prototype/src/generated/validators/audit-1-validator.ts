import { z } from 'zod';

/**
 * Zod schema for Audit_1 validation
 */
export const Audit_1Schema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  action: z.string().optional(),
  actorEmail: z.string().optional(),
  actorName: z.string().optional(),
  afterJson: z.string().optional(),
  beforeJson: z.string().optional(),
  entity: z.string().optional(),
  siteCode: z.string().optional(),
});

/**
 * Schema for creating a new Audit_1 (omits system-generated ID)
 */
export const CreateAudit_1Schema = Audit_1Schema.omit({ id: true });

/**
 * Schema for updating an existing Audit_1
 */
export const UpdateAudit_1Schema = Audit_1Schema;

export type Audit_1Input = z.infer<typeof Audit_1Schema>;
export type CreateAudit_1Input = z.infer<typeof CreateAudit_1Schema>;
export type UpdateAudit_1Input = z.infer<typeof UpdateAudit_1Schema>;