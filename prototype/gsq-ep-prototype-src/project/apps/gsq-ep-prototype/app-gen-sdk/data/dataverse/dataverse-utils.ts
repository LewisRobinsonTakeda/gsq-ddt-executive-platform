export function toODataBindPropertyName(schemaName: string): string {
  return `${schemaName}@odata.bind`;
}

export function extractRowId(value: string): string | null {
  // Extract rowId from entitySetName(rowId) format
  const match = value.match(/\(([^)]+)\)$/);
  const rowId = match?.[1] ?? null;
  return rowId;
}
