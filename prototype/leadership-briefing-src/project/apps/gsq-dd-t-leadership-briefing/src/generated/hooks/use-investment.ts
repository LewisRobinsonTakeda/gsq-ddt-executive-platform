import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvestmentService } from "../services/investment-service";
import type { Investment } from "../models/investment-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Investment records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, investmentName, approvedAmount, currencyCode, fiscalYear, forecastAmount, investmentCategoryKey, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useInvestmentList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["investment-list", options],
    queryFn: () => InvestmentService.getAll(options),
  });
}

/**
 * Retrieve a single Investment record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useInvestment(id: string) {
  return useQuery({
    queryKey: ["investment", id],
    queryFn: () => InvestmentService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Investment record.
 * @remarks Form validation: use CreateInvestmentSchema with zodResolver for type-safe create forms
 */
export function useCreateInvestment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Investment, "id">) => InvestmentService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["investment-list"] });
    },
  });
}

/**
 * Update an existing Investment record.
 * @remarks Form validation: use UpdateInvestmentSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateInvestment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Investment, "id">>;
    }) => InvestmentService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["investment-list"] });
      client.invalidateQueries({ queryKey: ["investment", variables.id] });
    },
  });
}

/**
 * Delete a Investment record by its unique identifier.
 */
export function useDeleteInvestment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvestmentService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["investment-list"] });
      client.invalidateQueries({ queryKey: ["investment", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Investment_DATA_SOURCE_TYPE = 'InMemory' as const;

export { InvestmentSchema, CreateInvestmentSchema, UpdateInvestmentSchema } from "../validators/investment-validator";
export type { InvestmentInput, CreateInvestmentInput, UpdateInvestmentInput } from "../validators/investment-validator";