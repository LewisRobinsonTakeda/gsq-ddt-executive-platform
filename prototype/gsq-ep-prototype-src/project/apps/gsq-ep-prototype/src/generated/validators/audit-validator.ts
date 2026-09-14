import { z } from 'zod';

/**
 * Zod schema for Audit validation
 */
export const AuditSchema = z.object({
  id: z.string().uuid(),
  auditEventName: z.string().min(1, { message: "Audit Event Name is required" }),
  actionKey: z.enum(['Created', 'Updated', 'Reviewed', 'Approved', 'Accessed']),
  details: z.string().min(1, { message: "Details is required" }),
  entityTableKey: z.enum(['Projects', 'Risks', 'Commentary', 'Financials', 'ReviewFreeze']),
  occurredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Occurred Date is required" }),
  recordReference: z.string().min(1, { message: "Record Reference is required" }),
  userSiteRole: z.object({ id: z.string().uuid(), userSiteRoleName: z.string() }),
});

/**
 * Schema for creating a new Audit (omits system-generated ID)
 */
export const CreateAuditSchema = AuditSchema.omit({ id: true });

/**
 * Schema for updating an existing Audit
 */
export const UpdateAuditSchema = AuditSchema;

export type AuditInput = z.infer<typeof AuditSchema>;
export type CreateAuditInput = z.infer<typeof CreateAuditSchema>;
export type UpdateAuditInput = z.infer<typeof UpdateAuditSchema>;