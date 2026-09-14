import { getClient } from '../../../app-gen-sdk/data';
import type { Commentary_1 } from '../models/commentary-1-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'Commentary_1';

export class Commentary_1Service {
  static async create(record: Omit<Commentary_1, 'id'>): Promise<Commentary_1> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as Commentary_1;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<Commentary_1, 'id'>>
  ): Promise<Commentary_1> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as Commentary_1;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<Commentary_1> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as Commentary_1;
  }

  static async getAll(options?: IOperationOptions): Promise<Commentary_1[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as Commentary_1[];
  }
}