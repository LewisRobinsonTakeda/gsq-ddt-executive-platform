import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IntegrationService } from "../services/integration-service";
import type { Integration } from "../models/integration-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Integration records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, integrationName, dataDomain, integrationNeeded, integrationStatusKey, ownershipNotes, sourceOwnerRoleKey, sourceSystemKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useIntegrationList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["integration-list", options],
    queryFn: () => IntegrationService.getAll(options),
  });
}

/**
 * Retrieve a single Integration record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useIntegration(id: string) {
  return useQuery({
    queryKey: ["integration", id],
    queryFn: () => IntegrationService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Integration record.
 * @remarks Form validation: use CreateIntegrationSchema with zodResolver for type-safe create forms
 */
export function useCreateIntegration() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Integration, "id">) => IntegrationService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["integration-list"] });
    },
  });
}

/**
 * Update an existing Integration record.
 * @remarks Form validation: use UpdateIntegrationSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateIntegration() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Integration, "id">>;
    }) => IntegrationService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["integration-list"] });
      client.invalidateQueries({ queryKey: ["integration", variables.id] });
    },
  });
}

/**
 * Delete a Integration record by its unique identifier.
 */
export function useDeleteIntegration() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => IntegrationService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["integration-list"] });
      client.invalidateQueries({ queryKey: ["integration", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Integration_DATA_SOURCE_TYPE = 'InMemory' as const;

export { IntegrationSchema, CreateIntegrationSchema, UpdateIntegrationSchema } from "../validators/integration-validator";
export type { IntegrationInput, CreateIntegrationInput, UpdateIntegrationInput } from "../validators/integration-validator";