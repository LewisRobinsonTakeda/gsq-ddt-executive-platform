import type { TableRow } from '../common/types';

type OrderDirection = 'asc' | 'desc';

type OrderByReturn = (a: TableRow, b: TableRow) => number;

export function createOrderByFn(orderBy?: string[]): OrderByReturn {
  if (!orderBy || orderBy.length === 0) {
    return (_a, _b) => 0;
  }

  const keys = orderBy.map((clause) => {
    const parts = clause.trim().split(/\s+/);
    const key = parts[0] ?? '';
    const dir = (parts[1]?.toLowerCase() as OrderDirection) || 'asc';
    return { key, dir };
  });

  return (a: TableRow, b: TableRow) => {
    for (const { key, dir } of keys) {
      if (!key) continue;
      const av = a[key];
      const bv = b[key];

      // Handle null/undefined values - nulls sort to the end
      if (av === null && bv === null) {
        continue;
      }
      if (av === null) {
        return dir === 'desc' ? -1 : 1;
      }
      if (bv === null) {
        return dir === 'desc' ? 1 : -1;
      }

      // Both values are non-null, compare them
      if (av === bv) {
        continue;
      }

      let result: number;

      // Type-aware comparison for string, number, boolean only
      if (typeof av === 'string' && typeof bv === 'string') {
        result = av.localeCompare(bv, undefined, {
          numeric: true,
          sensitivity: 'accent',
        });
      } else if (typeof av === 'number' && typeof bv === 'number') {
        result = av - bv;
      } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
        // false < true
        if (av === bv) {
          result = 0;
        } else if (av) {
          result = 1;
        } else {
          result = -1;
        }
      } else {
        // Mixed types - convert to string for comparison
        const aStr = String(av);
        const bStr = String(bv);
        result = aStr.localeCompare(bStr, undefined, {
          numeric: true,
          sensitivity: 'accent',
        });
      }

      if (result !== 0) {
        return dir === 'desc' ? -result : result;
      }
    }
    return 0;
  };
}
