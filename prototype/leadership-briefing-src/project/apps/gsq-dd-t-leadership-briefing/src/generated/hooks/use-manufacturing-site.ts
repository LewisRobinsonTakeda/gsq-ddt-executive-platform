import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ManufacturingSiteService } from "../services/manufacturing-site-service";
import type { ManufacturingSite } from "../models/manufacturing-site-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ManufacturingSite records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, siteName, briefingSequence, country, regionKey, siteCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useManufacturingSiteList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["manufacturingSite-list", options],
    queryFn: () => ManufacturingSiteService.getAll(options),
  });
}

/**
 * Retrieve a single ManufacturingSite record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useManufacturingSite(id: string) {
  return useQuery({
    queryKey: ["manufacturingSite", id],
    queryFn: () => ManufacturingSiteService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ManufacturingSite record.
 * @remarks Form validation: use CreateManufacturingSiteSchema with zodResolver for type-safe create forms
 */
export function useCreateManufacturingSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ManufacturingSite, "id">) => ManufacturingSiteService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["manufacturingSite-list"] });
    },
  });
}

/**
 * Update an existing ManufacturingSite record.
 * @remarks Form validation: use UpdateManufacturingSiteSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateManufacturingSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ManufacturingSite, "id">>;
    }) => ManufacturingSiteService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["manufacturingSite-list"] });
      client.invalidateQueries({ queryKey: ["manufacturingSite", variables.id] });
    },
  });
}

/**
 * Delete a ManufacturingSite record by its unique identifier.
 */
export function useDeleteManufacturingSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ManufacturingSiteService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["manufacturingSite-list"] });
      client.invalidateQueries({ queryKey: ["manufacturingSite", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ManufacturingSite_DATA_SOURCE_TYPE = 'InMemory' as const;

export { ManufacturingSiteSchema, CreateManufacturingSiteSchema, UpdateManufacturingSiteSchema } from "../validators/manufacturing-site-validator";
export type { ManufacturingSiteInput, CreateManufacturingSiteInput, UpdateManufacturingSiteInput } from "../validators/manufacturing-site-validator";