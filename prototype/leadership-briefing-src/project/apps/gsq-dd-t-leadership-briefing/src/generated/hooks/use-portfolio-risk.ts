import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PortfolioRiskService } from "../services/portfolio-risk-service";
import type { PortfolioRisk } from "../models/portfolio-risk-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all PortfolioRisk records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, riskName, closedDate, impactKey, likelihoodKey, mitigationSummary, riskScore, statusKey, targetResolutionDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function usePortfolioRiskList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["portfolioRisk-list", options],
    queryFn: () => PortfolioRiskService.getAll(options),
  });
}

/**
 * Retrieve a single PortfolioRisk record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function usePortfolioRisk(id: string) {
  return useQuery({
    queryKey: ["portfolioRisk", id],
    queryFn: () => PortfolioRiskService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new PortfolioRisk record.
 * @remarks Form validation: use CreatePortfolioRiskSchema with zodResolver for type-safe create forms
 */
export function useCreatePortfolioRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PortfolioRisk, "id">) => PortfolioRiskService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["portfolioRisk-list"] });
    },
  });
}

/**
 * Update an existing PortfolioRisk record.
 * @remarks Form validation: use UpdatePortfolioRiskSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdatePortfolioRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<PortfolioRisk, "id">>;
    }) => PortfolioRiskService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["portfolioRisk-list"] });
      client.invalidateQueries({ queryKey: ["portfolioRisk", variables.id] });
    },
  });
}

/**
 * Delete a PortfolioRisk record by its unique identifier.
 */
export function useDeletePortfolioRisk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PortfolioRiskService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["portfolioRisk-list"] });
      client.invalidateQueries({ queryKey: ["portfolioRisk", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const PortfolioRisk_DATA_SOURCE_TYPE = 'InMemory' as const;

export { PortfolioRiskSchema, CreatePortfolioRiskSchema, UpdatePortfolioRiskSchema } from "../validators/portfolio-risk-validator";
export type { PortfolioRiskInput, CreatePortfolioRiskInput, UpdatePortfolioRiskInput } from "../validators/portfolio-risk-validator";