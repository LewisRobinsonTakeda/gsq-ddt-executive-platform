import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditService } from "../services/audit-service";
import type { Audit } from "../models/audit-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Audit records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, auditEventName, actionKey, details, entityTableKey, occurredDate, recordReference
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAuditList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["audit-list", options],
    queryFn: () => AuditService.getAll(options),
  });
}

/**
 * Retrieve a single Audit record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAudit(id: string) {
  return useQuery({
    queryKey: ["audit", id],
    queryFn: () => AuditService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Audit record.
 * @remarks Form validation: use CreateAuditSchema with zodResolver for type-safe create forms
 */
export function useCreateAudit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Audit, "id">) => AuditService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["audit-list"] });
    },
  });
}

/**
 * Update an existing Audit record.
 * @remarks Form validation: use UpdateAuditSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAudit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Audit, "id">>;
    }) => AuditService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["audit-list"] });
      client.invalidateQueries({ queryKey: ["audit", variables.id] });
    },
  });
}

/**
 * Delete a Audit record by its unique identifier.
 */
export function useDeleteAudit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuditService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["audit-list"] });
      client.invalidateQueries({ queryKey: ["audit", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Audit_DATA_SOURCE_TYPE = 'InMemory' as const;

export { AuditSchema, CreateAuditSchema, UpdateAuditSchema } from "../validators/audit-validator";
export type { AuditInput, CreateAuditInput, UpdateAuditInput } from "../validators/audit-validator";