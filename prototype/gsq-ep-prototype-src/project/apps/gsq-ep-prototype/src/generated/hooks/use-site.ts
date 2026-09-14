import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteService } from "../services/site-service";
import type { Site } from "../models/site-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Site records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, name1, code, occupancyPercent, regionKey, sortOrder
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useSiteList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["site-list", options],
    queryFn: () => SiteService.getAll(options),
  });
}

/**
 * Retrieve a single Site record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useSite(id: string) {
  return useQuery({
    queryKey: ["site", id],
    queryFn: () => SiteService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Site record.
 * @remarks Form validation: use CreateSiteSchema with zodResolver for type-safe create forms
 */
export function useCreateSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Site, "id">) => SiteService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["site-list"] });
    },
  });
}

/**
 * Update an existing Site record.
 * @remarks Form validation: use UpdateSiteSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Site, "id">>;
    }) => SiteService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["site-list"] });
      client.invalidateQueries({ queryKey: ["site", variables.id] });
    },
  });
}

/**
 * Delete a Site record by its unique identifier.
 */
export function useDeleteSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SiteService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["site-list"] });
      client.invalidateQueries({ queryKey: ["site", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Site_DATA_SOURCE_TYPE = 'InMemory' as const;

export { SiteSchema, CreateSiteSchema, UpdateSiteSchema } from "../validators/site-validator";
export type { SiteInput, CreateSiteInput, UpdateSiteInput } from "../validators/site-validator";