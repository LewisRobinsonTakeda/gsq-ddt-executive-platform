import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlatformDeploymentService } from "../services/platform-deployment-service";
import type { PlatformDeployment } from "../models/platform-deployment-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all PlatformDeployment records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, platformDeploymentName, briefingNote, deploymentCode, statusKey, targetGoLiveDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function usePlatformDeploymentList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["platformDeployment-list", options],
    queryFn: () => PlatformDeploymentService.getAll(options),
  });
}

/**
 * Retrieve a single PlatformDeployment record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function usePlatformDeployment(id: string) {
  return useQuery({
    queryKey: ["platformDeployment", id],
    queryFn: () => PlatformDeploymentService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new PlatformDeployment record.
 * @remarks Form validation: use CreatePlatformDeploymentSchema with zodResolver for type-safe create forms
 */
export function useCreatePlatformDeployment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PlatformDeployment, "id">) => PlatformDeploymentService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["platformDeployment-list"] });
    },
  });
}

/**
 * Update an existing PlatformDeployment record.
 * @remarks Form validation: use UpdatePlatformDeploymentSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdatePlatformDeployment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<PlatformDeployment, "id">>;
    }) => PlatformDeploymentService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["platformDeployment-list"] });
      client.invalidateQueries({ queryKey: ["platformDeployment", variables.id] });
    },
  });
}

/**
 * Delete a PlatformDeployment record by its unique identifier.
 */
export function useDeletePlatformDeployment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PlatformDeploymentService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["platformDeployment-list"] });
      client.invalidateQueries({ queryKey: ["platformDeployment", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const PlatformDeployment_DATA_SOURCE_TYPE = 'InMemory' as const;

export { PlatformDeploymentSchema, CreatePlatformDeploymentSchema, UpdatePlatformDeploymentSchema } from "../validators/platform-deployment-validator";
export type { PlatformDeploymentInput, CreatePlatformDeploymentInput, UpdatePlatformDeploymentInput } from "../validators/platform-deployment-validator";