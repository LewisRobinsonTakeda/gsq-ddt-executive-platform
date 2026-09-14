import { filter as parseFilter } from 'odata-v4-parser';
import type { Token } from 'odata-v4-parser/lib/lexer';

export interface ParsedOrderByEntry {
  propertyName: string;
  direction: string;
}

export function getLogFriendlyAst(filter: string): Record<string, unknown> {
  return cleanAstHelper(parseFilter(filter));
}

function cleanAstHelper(node: Token): Record<string, unknown> {
  if (!node || typeof node !== 'object') {
    return node;
  }

  const cleaned: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(node)) {
    // Log the data type of raw values in the object
    if (key === 'raw') {
      cleaned.rawType = typeof val;
    }

    // Skip position, next, and raw properties
    if (key === 'position' || key === 'next' || key === 'raw') {
      continue;
    }

    // Recursively clean nested objects and arrays
    if (Array.isArray(val)) {
      cleaned[key] = val.map(cleanAstHelper);
    } else if (val && typeof val === 'object') {
      cleaned[key] = cleanAstHelper(val as Token);
    } else {
      cleaned[key] = val;
    }
  }

  return cleaned;
}

export function parseOrderByEntry(orderByEntry: string): ParsedOrderByEntry {
  const parts = orderByEntry.trim().split(/\s+/);
  const propertyName = parts[0] ?? '';
  const direction = parts[1] ?? '';

  return {
    propertyName,
    direction,
  };
}

export function throwIfOrderByFormatIsInvalid(orderByEntries: string[]): void {
  if (!Array.isArray(orderByEntries)) {
    throw new Error(
      `Invalid orderBy format: expected an array, but got ${typeof orderByEntries}`,
    );
  }

  for (const entry of orderByEntries) {
    const trimmedEntry = entry.trim();

    if (!trimmedEntry) {
      throw new Error(
        `Invalid orderBy format: "${entry}". Property name cannot be empty`,
      );
    }

    const parts = trimmedEntry.split(/\s+/);

    if (parts.length === 0 || parts.length > 2) {
      throw new Error(
        `Invalid orderBy format: "${entry}". Expected format: "propertyName", "propertyName asc", or "propertyName desc"`,
      );
    }

    if (parts.length === 2 && parts[1]) {
      const direction = parts[1].toLowerCase();
      if (direction !== 'asc' && direction !== 'desc') {
        throw new Error(
          `Invalid orderBy direction: "${parts[1]}". Expected "asc" or "desc" but got "${parts[1]}"`,
        );
      }
    }

    if (!parts[0] || parts[0].trim() === '') {
      throw new Error(
        `Invalid orderBy format: "${entry}". Property name cannot be empty`,
      );
    }
  }
}
