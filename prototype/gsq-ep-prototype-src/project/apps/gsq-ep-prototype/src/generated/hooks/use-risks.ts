import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RisksService } from "../services/risks-service";
import type { Risks } from "../models/risks-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Risks records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, due, jiraKey, mitigation, ownerName, relatedSpotId, severity, siteCode, source, statusCanonical
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useRisksList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["risks-list", options],
    queryFn: () => RisksService.getAll(options),
  });
}

/**
 * Retrieve a single Risks record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useRisks(id: string) {
  return useQuery({
    queryKey: ["risks", id],
    queryFn: () => RisksService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Risks record.
 * @remarks Form validation: use CreateRisksSchema with zodResolver for type-safe create forms
 */
export function useCreateRisks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Risks, "id">) => RisksService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["risks-list"] });
    },
  });
}

/**
 * Update an existing Risks record.
 * @remarks Form validation: use UpdateRisksSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateRisks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Risks, "id">>;
    }) => RisksService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["risks-list"] });
      client.invalidateQueries({ queryKey: ["risks", variables.id] });
    },
  });
}

/**
 * Delete a Risks record by its unique identifier.
 */
export function useDeleteRisks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RisksService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["risks-list"] });
      client.invalidateQueries({ queryKey: ["risks", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Risks_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { RisksSchema, CreateRisksSchema, UpdateRisksSchema } from "../validators/risks-validator";
export type { RisksInput, CreateRisksInput, UpdateRisksInput } from "../validators/risks-validator";