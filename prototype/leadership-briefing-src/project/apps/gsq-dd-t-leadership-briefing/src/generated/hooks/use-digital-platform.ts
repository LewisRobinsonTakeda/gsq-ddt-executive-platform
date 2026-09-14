import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DigitalPlatformService } from "../services/digital-platform-service";
import type { DigitalPlatform } from "../models/digital-platform-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all DigitalPlatform records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, digitalPlatformName, description, platformCategoryKey, platformCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useDigitalPlatformList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["digitalPlatform-list", options],
    queryFn: () => DigitalPlatformService.getAll(options),
  });
}

/**
 * Retrieve a single DigitalPlatform record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useDigitalPlatform(id: string) {
  return useQuery({
    queryKey: ["digitalPlatform", id],
    queryFn: () => DigitalPlatformService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new DigitalPlatform record.
 * @remarks Form validation: use CreateDigitalPlatformSchema with zodResolver for type-safe create forms
 */
export function useCreateDigitalPlatform() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<DigitalPlatform, "id">) => DigitalPlatformService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["digitalPlatform-list"] });
    },
  });
}

/**
 * Update an existing DigitalPlatform record.
 * @remarks Form validation: use UpdateDigitalPlatformSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateDigitalPlatform() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<DigitalPlatform, "id">>;
    }) => DigitalPlatformService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["digitalPlatform-list"] });
      client.invalidateQueries({ queryKey: ["digitalPlatform", variables.id] });
    },
  });
}

/**
 * Delete a DigitalPlatform record by its unique identifier.
 */
export function useDeleteDigitalPlatform() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DigitalPlatformService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["digitalPlatform-list"] });
      client.invalidateQueries({ queryKey: ["digitalPlatform", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const DigitalPlatform_DATA_SOURCE_TYPE = 'InMemory' as const;

export { DigitalPlatformSchema, CreateDigitalPlatformSchema, UpdateDigitalPlatformSchema } from "../validators/digital-platform-validator";
export type { DigitalPlatformInput, CreateDigitalPlatformInput, UpdateDigitalPlatformInput } from "../validators/digital-platform-validator";