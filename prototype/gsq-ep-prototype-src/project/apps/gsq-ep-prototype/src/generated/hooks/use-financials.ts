import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinancialsService } from "../services/financials-service";
import type { Financials } from "../models/financials-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Financials records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actual, approved, asOf, forecast, fY, integrationNeeded, jiraKey, siteCode, spotId
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useFinancialsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["financials-list", options],
    queryFn: () => FinancialsService.getAll(options),
  });
}

/**
 * Retrieve a single Financials record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useFinancials(id: string) {
  return useQuery({
    queryKey: ["financials", id],
    queryFn: () => FinancialsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Financials record.
 * @remarks Form validation: use CreateFinancialsSchema with zodResolver for type-safe create forms
 */
export function useCreateFinancials() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Financials, "id">) => FinancialsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["financials-list"] });
    },
  });
}

/**
 * Update an existing Financials record.
 * @remarks Form validation: use UpdateFinancialsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateFinancials() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Financials, "id">>;
    }) => FinancialsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["financials-list"] });
      client.invalidateQueries({ queryKey: ["financials", variables.id] });
    },
  });
}

/**
 * Delete a Financials record by its unique identifier.
 */
export function useDeleteFinancials() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => FinancialsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["financials-list"] });
      client.invalidateQueries({ queryKey: ["financials", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Financials_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { FinancialsSchema, CreateFinancialsSchema, UpdateFinancialsSchema } from "../validators/financials-validator";
export type { FinancialsInput, CreateFinancialsInput, UpdateFinancialsInput } from "../validators/financials-validator";