import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiskService } from "../services/risk-service";
import type { Risk } from "../models/risk-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Risk records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, riskName, createdDate, entrySourceKey, likelihoodKey, reviewComments, reviewedDate, riskDescription, riskStatusKey, severityKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useRiskList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["risk-list", options],
    queryFn: () => RiskService.getAll(options),
  });
}

/**
 * Retrieve a single Risk record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useRisk(id: string) {
  return useQuery({
    queryKey: ["risk", id],
    queryFn: () => RiskService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Risk record.
 * @remarks Form validation: use CreateRiskSchema with zodResolver for type-safe create forms
 */
export function useCreateRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Risk, "id">) => RiskService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["risk-list"] });
    },
  });
}

/**
 * Update an existing Risk record.
 * @remarks Form validation: use UpdateRiskSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Risk, "id">>;
    }) => RiskService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["risk-list"] });
      client.invalidateQueries({ queryKey: ["risk", variables.id] });
    },
  });
}

/**
 * Delete a Risk record by its unique identifier.
 */
export function useDeleteRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RiskService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["risk-list"] });
      client.invalidateQueries({ queryKey: ["risk", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Risk_DATA_SOURCE_TYPE = 'InMemory' as const;

export { RiskSchema, CreateRiskSchema, UpdateRiskSchema } from "../validators/risk-validator";
export type { RiskInput, CreateRiskInput, UpdateRiskInput } from "../validators/risk-validator";