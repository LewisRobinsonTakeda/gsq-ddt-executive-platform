import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSiteRoleService } from "../services/user-site-role-service";
import type { UserSiteRole } from "../models/user-site-role-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserSiteRole records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, userSiteRoleName, accessScopeKey, canEditSharePointEntryData, canViewFinancials, roleKey, roleStatusKey, userEmail
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserSiteRoleList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userSiteRole-list", options],
    queryFn: () => UserSiteRoleService.getAll(options),
  });
}

/**
 * Retrieve a single UserSiteRole record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserSiteRole(id: string) {
  return useQuery({
    queryKey: ["userSiteRole", id],
    queryFn: () => UserSiteRoleService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserSiteRole record.
 * @remarks Form validation: use CreateUserSiteRoleSchema with zodResolver for type-safe create forms
 */
export function useCreateUserSiteRole() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserSiteRole, "id">) => UserSiteRoleService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userSiteRole-list"] });
    },
  });
}

/**
 * Update an existing UserSiteRole record.
 * @remarks Form validation: use UpdateUserSiteRoleSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserSiteRole() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserSiteRole, "id">>;
    }) => UserSiteRoleService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userSiteRole-list"] });
      client.invalidateQueries({ queryKey: ["userSiteRole", variables.id] });
    },
  });
}

/**
 * Delete a UserSiteRole record by its unique identifier.
 */
export function useDeleteUserSiteRole() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserSiteRoleService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userSiteRole-list"] });
      client.invalidateQueries({ queryKey: ["userSiteRole", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserSiteRole_DATA_SOURCE_TYPE = 'InMemory' as const;

export { UserSiteRoleSchema, CreateUserSiteRoleSchema, UpdateUserSiteRoleSchema } from "../validators/user-site-role-validator";
export type { UserSiteRoleInput, CreateUserSiteRoleInput, UpdateUserSiteRoleInput } from "../validators/user-site-role-validator";