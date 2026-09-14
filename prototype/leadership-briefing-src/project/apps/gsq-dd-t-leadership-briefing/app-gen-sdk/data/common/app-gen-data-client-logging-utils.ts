import type { ScenarioContext } from './logger-client';
import type { TableToTypescriptMapping } from './table-mapping-types';
import type { TableRow } from './types';

export function addTableMetadataToScenarioContext(
  baseContext: ScenarioContext,
  tableMetadata: TableToTypescriptMapping,
): void {
  baseContext.dataSourceType = tableMetadata.dataSourceType;
}

export function addResponsePropertyContextData(
  baseContext: ScenarioContext,
  typescriptRecords: TableRow[],
): void {
  baseContext.resultCount = typescriptRecords.length;
  baseContext.ids = typescriptRecords.map((record) => record.id);
}

export function addPropertyContextData(
  propertyName: string,
  baseContext: ScenarioContext,
  apiRecord: TableRow,
): void {
  baseContext[propertyName] = Object.keys(apiRecord).map((key) => {
    const value = apiRecord[key];
    let dataType: string;

    if (value === null) {
      dataType = 'null';
    } else if (value === undefined) {
      dataType = 'undefined';
    } else {
      dataType = typeof value;
    }

    return {
      name: key,
      hasValue: value !== undefined && value !== null,
      valueLength: value?.toString().length,
      dataType,
    };
  });
}
