import { v4 as uuid } from 'uuid';

import { isPlayingApp } from '../../constants';
import { getRpcClient } from '../../rpc-client';
import { createErrorLog } from '../../utils/exception-utils';
import type {
  ColumnToTypescriptMapping,
  TableToTypescriptMapping,
} from './table-mapping-types';

const sessionId = uuid();

export function logError(name: string, error: unknown, data?: object): void {
  if (isPlayingApp) {
    return;
  }
  getRpcClient()
    .call('logError', [createErrorLog(name, { sessionId, ...data }, error)])
    .catch((rpcError) => {
      console.error(`Failed to log error for ${name}`, rpcError);
    });
}

export function logWarning(eventName: string, data: object): void {
  if (isPlayingApp) {
    return;
  }
  getRpcClient()
    .call('logWarning', [{ eventName, data: { sessionId, ...data } }])
    .catch((rpcError) => {
      console.error(`Failed to log warning for ${eventName}`, rpcError);
    });
}

export function logInfo(eventName: string, data: object): void {
  if (isPlayingApp) {
    return;
  }
  getRpcClient()
    .call('logInfo', [{ eventName, data: { sessionId, ...data } }])
    .catch((rpcError) => {
      console.error(`Failed to log info for ${eventName}`, rpcError);
    });
}

export interface TableAndColumnEventData {
  tableApiMetadataTableId: string;
  tableDataSourceType: string;
  columnType: string;
  columnApiPropertyName: string;
}

export function getTableAndColumnEventData(
  tableMetadata: TableToTypescriptMapping,
  column: ColumnToTypescriptMapping,
): TableAndColumnEventData {
  return {
    tableApiMetadataTableId: tableMetadata.apiMetadataTableId,
    tableDataSourceType: tableMetadata.dataSourceType,
    columnApiPropertyName: column.apiPropertyName,
    columnType: column.type,
  };
}

export type ScenarioContext = Record<string, unknown>;

export async function withScenarioLogging<T>(
  scenarioName: string,
  baseContext: ScenarioContext,
  operation: () => Promise<T>,
): Promise<T> {
  const startTime = performance.now();
  const scenarioId = uuid();

  logInfo(`${scenarioName}/Started`, { scenarioId, ...baseContext });

  try {
    const result = await operation();
    logInfo(`${scenarioName}/Completed`, {
      scenarioId,
      ...baseContext,
      duration: performance.now() - startTime,
    });
    return result;
  } catch (error) {
    logError(`${scenarioName}/Failed`, error, {
      scenarioId,
      ...baseContext,
      duration: performance.now() - startTime,
    });
    const anyError = error as Error;
    anyError.message = cleanErrorMessage(
      `${anyError.message}, Stack: ${anyError.stack}`,
    );

    throw error;
  }
}

export function cleanErrorMessage(errorMessage: string): string {
  if (!errorMessage) {
    return '';
  }

  // Remove URLs but keep filename:line:column pattern
  // Matches https://domain/path/ but stops before filename.ext
  return errorMessage.replace(/https?:\/\/[^/\s]+\/[^/\s]*\//g, '');
}
