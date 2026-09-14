import { CommonDataSourceOperations } from '../common/common-data-source-operations';
import type {
  ChoiceColumnToTypescriptMapping,
  LookupColumnToTypescriptMapping,
  TableToTypescriptMapping,
} from '../common/table-mapping-types';
import { getTargetTableMetadata } from '../common/table-metadata-utils';
import type { IAppGenDataClient, TableCell } from '../common/types';
import {
  formatAsDataverseLookup,
  formatChoicesAsCommaSeparatedString,
  mapInMemoryLookupApiCellToDataSourceCell,
} from '../dataverse/dataverse-formatters';
import { toODataBindPropertyName } from '../dataverse/dataverse-utils';
import { AppGenInMemoryDataClient } from './in-memory-data-client';

export const inMemoryDataSourceOperations = getInMemoryDataSourceOperations(
  new AppGenInMemoryDataClient(),
);

export function getInMemoryDataSourceOperations(
  dataClient: IAppGenDataClient,
): CommonDataSourceOperations {
  return new CommonDataSourceOperations({
    dataClient,
    mapApiRowToDataSourceRowOptions: {
      customFormatters: {
        Lookup: async (options): Promise<TableCell> => {
          const lookupColumn =
            options.column as LookupColumnToTypescriptMapping;
          return (await mapInMemoryLookupApiCellToDataSourceCell({
            column: lookupColumn,
            tableCell: options.tableCell,
            row: options.row,
            dataClient: options.dataClient,
            tableMetadata: options.tableMetadata,
          })) as TableCell;
        },
      },
      getCustomApiPropertyName: {
        Lookup: (options): string => {
          return toODataBindPropertyName(
            options.column.apiPropertyNameCaseSensitive,
          );
        },
      },
    },
    mapDataSourceRowToApiRowOptions: {
      customFormatters: {
        Choices: async (options): Promise<TableCell> => {
          const choiceColumn =
            options.column as ChoiceColumnToTypescriptMapping;
          return Promise.resolve(
            formatChoicesAsCommaSeparatedString(
              options.tableMetadata,
              choiceColumn,
              options.tableCell,
            ) as TableCell,
          );
        },
        Lookup: async (options): Promise<TableCell> => {
          const lookupColumn =
            options.column as LookupColumnToTypescriptMapping;
          return Promise.resolve(
            formatAsDataverseLookup(
              options.tableMetadata,
              lookupColumn,
              options.tableCell,
            ) as TableCell,
          );
        },
      },
      getCustomOutputApiPropertyName: {
        Lookup: (options): string => {
          return toODataBindPropertyName(
            options.column.apiPropertyNameCaseSensitive,
          );
        },
      },
    },
    convertRetrieveAllOptionsFromTypescriptToApiOptions: {
      convertFilterAsync: async (
        tableMetadata: TableToTypescriptMapping,
        filter: string,
      ): Promise<string> => {
        for (const columnMapping of tableMetadata.columns) {
          if (columnMapping.type === 'Lookup') {
            const lookupColumn =
              columnMapping as LookupColumnToTypescriptMapping;
            const targetTable = await getTargetTableMetadata({
              targetTableApiMetadataTableId:
                lookupColumn.lookupMetadata.targetTableApiMetadataTableId,
            });

            // Lookup Primary Id
            filter = filter.replace(
              `${columnMapping.typescriptPropertyName}/${targetTable.primaryIdColumnMapping.typescriptPropertyName}`,
              `_${lookupColumn.apiPropertyName}_value`,
            );
            // Lookup Primary Name
            filter = filter.replace(
              `${columnMapping.typescriptPropertyName}/${targetTable.primaryNameColumnMapping.typescriptPropertyName}`,
              `_${lookupColumn.apiPropertyName}_formatted_value`,
            );
          } else if (
            columnMapping.type === 'Choices' ||
            columnMapping.type === 'Choice'
          ) {
            const choiceColumn =
              columnMapping as ChoiceColumnToTypescriptMapping;
            for (const option of choiceColumn.optionSetMetadata.options) {
              const apiValueFormatted =
                typeof option.apiValue === 'string'
                  ? `'${option.apiValue}'`
                  : option.apiValue;
              filter = filter.replace(
                `'${option.typescriptValue}'`,
                `${apiValueFormatted}`,
              );
            }
          }
        }
        return filter;
      },
      convertOrderByAsync: async (
        tableMetadata: TableToTypescriptMapping,
        orderBy: string[],
      ): Promise<string[]> => {
        const updatedOrderBy: string[] = [];
        for (let orderByEntry of orderBy) {
          for (const columnMapping of tableMetadata.columns) {
            if (columnMapping.type === 'Lookup') {
              const lookupColumn =
                columnMapping as LookupColumnToTypescriptMapping;
              const targetTable = await getTargetTableMetadata({
                targetTableApiMetadataTableId:
                  lookupColumn.lookupMetadata.targetTableApiMetadataTableId,
              });

              // Lookup Primary Id
              orderByEntry = orderByEntry.replace(
                `${columnMapping.typescriptPropertyName}/${targetTable.primaryIdColumnMapping.typescriptPropertyName}`,
                `_${lookupColumn.apiPropertyName}_value`,
              );
              // Lookup Primary Name
              orderByEntry = orderByEntry.replace(
                `${columnMapping.typescriptPropertyName}/${targetTable.primaryNameColumnMapping.typescriptPropertyName}`,
                `_${lookupColumn.apiPropertyName}_formatted_value`,
              );
            }
          }
          updatedOrderBy.push(orderByEntry);
        }

        return updatedOrderBy;
      },
    },
  });
}
