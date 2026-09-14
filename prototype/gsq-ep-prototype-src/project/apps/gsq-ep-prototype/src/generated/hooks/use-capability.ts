import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CapabilityService } from "../services/capability-service";
import type { Capability } from "../models/capability-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Capability records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, capabilityName, capabilityStatusKey, eDBDomain, eDBIntegrationNeeded, eDBSourceOwnerRoleKey, gapSummary, maturityLevelKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useCapabilityList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["capability-list", options],
    queryFn: () => CapabilityService.getAll(options),
  });
}

/**
 * Retrieve a single Capability record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useCapability(id: string) {
  return useQuery({
    queryKey: ["capability", id],
    queryFn: () => CapabilityService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Capability record.
 * @remarks Form validation: use CreateCapabilitySchema with zodResolver for type-safe create forms
 */
export function useCreateCapability() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Capability, "id">) => CapabilityService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["capability-list"] });
    },
  });
}

/**
 * Update an existing Capability record.
 * @remarks Form validation: use UpdateCapabilitySchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateCapability() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Capability, "id">>;
    }) => CapabilityService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["capability-list"] });
      client.invalidateQueries({ queryKey: ["capability", variables.id] });
    },
  });
}

/**
 * Delete a Capability record by its unique identifier.
 */
export function useDeleteCapability() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CapabilityService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["capability-list"] });
      client.invalidateQueries({ queryKey: ["capability", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Capability_DATA_SOURCE_TYPE = 'InMemory' as const;

export { CapabilitySchema, CreateCapabilitySchema, UpdateCapabilitySchema } from "../validators/capability-validator";
export type { CapabilityInput, CreateCapabilityInput, UpdateCapabilityInput } from "../validators/capability-validator";