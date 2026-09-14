import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Audit_1Service } from "../services/audit-1-service";
import type { Audit_1 } from "../models/audit-1-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Audit_1 records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, action, actorEmail, actorName, afterJson, beforeJson, entity, siteCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAudit_1List(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["audit_1-list", options],
    queryFn: () => Audit_1Service.getAll(options),
  });
}

/**
 * Retrieve a single Audit_1 record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAudit_1(id: string) {
  return useQuery({
    queryKey: ["audit_1", id],
    queryFn: () => Audit_1Service.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Audit_1 record.
 * @remarks Form validation: use CreateAudit_1Schema with zodResolver for type-safe create forms
 */
export function useCreateAudit_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Audit_1, "id">) => Audit_1Service.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["audit_1-list"] });
    },
  });
}

/**
 * Update an existing Audit_1 record.
 * @remarks Form validation: use UpdateAudit_1Schema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAudit_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Audit_1, "id">>;
    }) => Audit_1Service.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["audit_1-list"] });
      client.invalidateQueries({ queryKey: ["audit_1", variables.id] });
    },
  });
}

/**
 * Delete a Audit_1 record by its unique identifier.
 */
export function useDeleteAudit_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Audit_1Service.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["audit_1-list"] });
      client.invalidateQueries({ queryKey: ["audit_1", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Audit_1_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { Audit_1Schema, CreateAudit_1Schema, UpdateAudit_1Schema } from "../validators/audit-1-validator";
export type { Audit_1Input, CreateAudit_1Input, UpdateAudit_1Input } from "../validators/audit-1-validator";