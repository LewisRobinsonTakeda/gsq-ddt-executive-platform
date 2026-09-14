import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PortfolioInitiativeService } from "../services/portfolio-initiative-service";
import type { PortfolioInitiative } from "../models/portfolio-initiative-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all PortfolioInitiative records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, portfolioInitiativeName, executiveSummary, goldenThread, initiativeCode, sPOTNumber, statusKey, targetDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function usePortfolioInitiativeList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["portfolioInitiative-list", options],
    queryFn: () => PortfolioInitiativeService.getAll(options),
  });
}

/**
 * Retrieve a single PortfolioInitiative record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function usePortfolioInitiative(id: string) {
  return useQuery({
    queryKey: ["portfolioInitiative", id],
    queryFn: () => PortfolioInitiativeService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new PortfolioInitiative record.
 * @remarks Form validation: use CreatePortfolioInitiativeSchema with zodResolver for type-safe create forms
 */
export function useCreatePortfolioInitiative() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PortfolioInitiative, "id">) => PortfolioInitiativeService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["portfolioInitiative-list"] });
    },
  });
}

/**
 * Update an existing PortfolioInitiative record.
 * @remarks Form validation: use UpdatePortfolioInitiativeSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdatePortfolioInitiative() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<PortfolioInitiative, "id">>;
    }) => PortfolioInitiativeService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["portfolioInitiative-list"] });
      client.invalidateQueries({ queryKey: ["portfolioInitiative", variables.id] });
    },
  });
}

/**
 * Delete a PortfolioInitiative record by its unique identifier.
 */
export function useDeletePortfolioInitiative() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PortfolioInitiativeService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["portfolioInitiative-list"] });
      client.invalidateQueries({ queryKey: ["portfolioInitiative", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const PortfolioInitiative_DATA_SOURCE_TYPE = 'InMemory' as const;

export { PortfolioInitiativeSchema, CreatePortfolioInitiativeSchema, UpdatePortfolioInitiativeSchema } from "../validators/portfolio-initiative-validator";
export type { PortfolioInitiativeInput, CreatePortfolioInitiativeInput, UpdatePortfolioInitiativeInput } from "../validators/portfolio-initiative-validator";