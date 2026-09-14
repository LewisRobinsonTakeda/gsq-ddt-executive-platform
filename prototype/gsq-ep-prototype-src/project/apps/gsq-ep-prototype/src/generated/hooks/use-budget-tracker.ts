import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetTrackerService } from "../services/budget-tracker-service";
import type { BudgetTracker } from "../models/budget-tracker-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all BudgetTracker records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, budgetId, capex, depreciation, fundingNote, fYKey, localVsGlobal, opex, projectDescription, siteCode, siteLabel, spotId, valueCreation
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useBudgetTrackerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["budgetTracker-list", options],
    queryFn: () => BudgetTrackerService.getAll(options),
  });
}

/**
 * Retrieve a single BudgetTracker record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useBudgetTracker(id: string) {
  return useQuery({
    queryKey: ["budgetTracker", id],
    queryFn: () => BudgetTrackerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new BudgetTracker record.
 * @remarks Form validation: use CreateBudgetTrackerSchema with zodResolver for type-safe create forms
 */
export function useCreateBudgetTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BudgetTracker, "id">) => BudgetTrackerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["budgetTracker-list"] });
    },
  });
}

/**
 * Update an existing BudgetTracker record.
 * @remarks Form validation: use UpdateBudgetTrackerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateBudgetTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<BudgetTracker, "id">>;
    }) => BudgetTrackerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["budgetTracker-list"] });
      client.invalidateQueries({ queryKey: ["budgetTracker", variables.id] });
    },
  });
}

/**
 * Delete a BudgetTracker record by its unique identifier.
 */
export function useDeleteBudgetTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BudgetTrackerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["budgetTracker-list"] });
      client.invalidateQueries({ queryKey: ["budgetTracker", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const BudgetTracker_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { BudgetTrackerSchema, CreateBudgetTrackerSchema, UpdateBudgetTrackerSchema } from "../validators/budget-tracker-validator";
export type { BudgetTrackerInput, CreateBudgetTrackerInput, UpdateBudgetTrackerInput } from "../validators/budget-tracker-validator";