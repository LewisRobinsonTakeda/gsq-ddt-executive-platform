import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinancialClassificationService } from "../services/financial-classification-service";
import type { FinancialClassification } from "../models/financial-classification-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all FinancialClassification records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, financialClassificationName, investmentClassificationKey, recordStatusKey, sPOTID, sPOTIntegrationNeeded, sPOTSourceOwnerRoleKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useFinancialClassificationList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["financialClassification-list", options],
    queryFn: () => FinancialClassificationService.getAll(options),
  });
}

/**
 * Retrieve a single FinancialClassification record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useFinancialClassification(id: string) {
  return useQuery({
    queryKey: ["financialClassification", id],
    queryFn: () => FinancialClassificationService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new FinancialClassification record.
 * @remarks Form validation: use CreateFinancialClassificationSchema with zodResolver for type-safe create forms
 */
export function useCreateFinancialClassification() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FinancialClassification, "id">) => FinancialClassificationService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["financialClassification-list"] });
    },
  });
}

/**
 * Update an existing FinancialClassification record.
 * @remarks Form validation: use UpdateFinancialClassificationSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateFinancialClassification() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<FinancialClassification, "id">>;
    }) => FinancialClassificationService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["financialClassification-list"] });
      client.invalidateQueries({ queryKey: ["financialClassification", variables.id] });
    },
  });
}

/**
 * Delete a FinancialClassification record by its unique identifier.
 */
export function useDeleteFinancialClassification() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => FinancialClassificationService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["financialClassification-list"] });
      client.invalidateQueries({ queryKey: ["financialClassification", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const FinancialClassification_DATA_SOURCE_TYPE = 'InMemory' as const;

export { FinancialClassificationSchema, CreateFinancialClassificationSchema, UpdateFinancialClassificationSchema } from "../validators/financial-classification-validator";
export type { FinancialClassificationInput, CreateFinancialClassificationInput, UpdateFinancialClassificationInput } from "../validators/financial-classification-validator";