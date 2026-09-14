import type { FilterFunction } from 'odata-v4-inmemory';
import {
  FilterVisitor,
  ODataMethodMap,
} from 'odata-v4-inmemory/lib/FilterVisitor';
import { filter as parseFilter } from 'odata-v4-parser';
import type { Token } from 'odata-v4-parser/lib/lexer';

import { convertFromIsoString } from '../common/common-formatters';
import type { TableCell } from '../common/types';

export class CustomFilterVisitor extends FilterVisitor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override getLiteral(node: Token): any {
    switch (node.value) {
      case 'Edm.Int32':
      case 'Edm.Int16':
        return Number.parseInt(node.raw, 10);
      case 'Edm.Byte':
        return node.raw;
      default:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return super.getLiteral(node as any);
    }
  }
}

function getDateTimeComponent(
  value: TableCell,
  component:
    | 'full'
    | 'date'
    | 'hour'
    | 'minute'
    | 'second'
    | 'year'
    | 'month'
    | 'day',
): TableCell {
  if (value === null || value === undefined || typeof value !== 'string') {
    return value;
  }

  const dateTime = convertFromIsoString(value, false);
  if (typeof dateTime !== 'string') {
    return value;
  }

  const [datePart, timePart] = dateTime.split('T');

  if (!datePart) {
    return value;
  }

  const dateParts = datePart.split('-');
  const timeParts = timePart?.split(':') ?? [];

  switch (component) {
    case 'full':
      return dateTime;
    case 'date':
      return datePart;
    case 'year':
      return parseInt(dateParts[0] ?? '0', 10);
    case 'month':
      return parseInt(dateParts[1] ?? '0', 10);
    case 'day':
      return parseInt(dateParts[2] ?? '0', 10);
    case 'hour':
      return timePart ? parseInt(timeParts[0] ?? '0', 10) : 0;
    case 'minute':
      return timePart ? parseInt(timeParts[1] ?? '0', 10) : 0;
    case 'second':
      return timePart && timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    default:
      return dateTime;
  }
}

const localDataMethodMap: Record<
  string,
  (value: TableCell, compValue: TableCell) => TableCell
> = {
  date: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'date');
  },
  year: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'year');
  },
  day: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'day');
  },
  month: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'month');
  },
  hour: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'hour');
  },
  minute: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'minute');
  },
  second: (value: TableCell, _compValue: TableCell): TableCell => {
    return getDateTimeComponent(value, 'second');
  },
  indexof: (value: TableCell, searchValue: TableCell): TableCell => {
    const valueStr = (value as string)?.toLowerCase?.();
    const searchStr = (searchValue as string)?.toLowerCase?.();
    return valueStr?.indexOf?.(searchStr) ?? -1;
  },
  substring: (value: TableCell, start: TableCell): TableCell => {
    return (value as string)?.substring?.(start as number) ?? value;
  },
  contains: (value: TableCell, searchValue: TableCell): TableCell => {
    const valueStr = (value as string)?.toLowerCase?.();
    const searchStr = (searchValue as string)?.toLowerCase?.();
    return valueStr?.includes?.(searchStr) ?? false;
  },
  endswith: (value: TableCell, searchValue: TableCell): TableCell => {
    const valueStr = (value as string)?.toLowerCase?.();
    const searchStr = (searchValue as string)?.toLowerCase?.();
    return valueStr?.endsWith?.(searchStr) ?? false;
  },
  startswith: (value: TableCell, searchValue: TableCell): TableCell => {
    const valueStr = (value as string)?.toLowerCase?.();
    const searchStr = (searchValue as string)?.toLowerCase?.();
    return valueStr?.startsWith?.(searchStr) ?? false;
  },
  tolower: (value: TableCell, _compValue: TableCell): TableCell => {
    return (value as string)?.toLowerCase?.() ?? value;
  },
  toupper: (value: TableCell, _compValue: TableCell): TableCell => {
    return (value as string)?.toUpperCase?.() ?? value;
  },
};
Object.assign(ODataMethodMap, localDataMethodMap);

const customFilterVisitor = new CustomFilterVisitor();

export function createCustomFilter(filter: string | Token): FilterFunction {
  const ast: Token = (
    typeof filter === 'string' ? parseFilter(filter as string) : filter
  ) as Token;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  return customFilterVisitor.Visit(ast as any, {});
}
