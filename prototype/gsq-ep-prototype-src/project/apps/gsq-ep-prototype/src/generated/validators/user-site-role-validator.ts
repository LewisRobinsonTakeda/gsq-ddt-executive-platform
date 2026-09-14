import { z } from 'zod';

/**
 * Zod schema for UserSiteRole validation
 */
export const UserSiteRoleSchema = z.object({
  id: z.string().uuid(),
  userSiteRoleName: z.string().min(1, { message: "User Site Role Name is required" }),
  accessScopeKey: z.enum(['AllSites', 'AssignedSiteOnly']),
  assignedSite: z.object({ id: z.string().uuid(), name1: z.string() }),
  canEditSharePointEntryData: z.boolean(),
  canViewFinancials: z.boolean(),
  roleKey: z.enum(['PlatformAdmin', 'Executive', 'SiteEditor', 'SiteViewer']),
  roleStatusKey: z.enum(['Pending', 'Active', 'Suspended', 'Expired']),
  userEmail: z.string().email().min(1, { message: "User Email is required" }),
});

/**
 * Schema for creating a new UserSiteRole (omits system-generated ID)
 */
export const CreateUserSiteRoleSchema = UserSiteRoleSchema.omit({ id: true });

/**
 * Schema for updating an existing UserSiteRole
 */
export const UpdateUserSiteRoleSchema = UserSiteRoleSchema;

export type UserSiteRoleInput = z.infer<typeof UserSiteRoleSchema>;
export type CreateUserSiteRoleInput = z.infer<typeof CreateUserSiteRoleSchema>;
export type UpdateUserSiteRoleInput = z.infer<typeof UpdateUserSiteRoleSchema>;