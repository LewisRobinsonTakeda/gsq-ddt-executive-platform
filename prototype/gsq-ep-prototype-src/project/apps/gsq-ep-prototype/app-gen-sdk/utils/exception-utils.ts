export interface ErrorLog {
  eventName: string;
  data: unknown;
  error: {
    message: string;
    stack?: string;
    name: string;
    timestamp: string;
    originalError: unknown;
  };
}

export function createErrorLog(
  eventName: string,
  data: unknown,
  error: unknown,
): ErrorLog {
  const errorDetails = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : new Error().stack,
    name: error instanceof Error ? error.name : 'Unknown',
    timestamp: new Date().toISOString(),
    originalError: error,
  };

  return { eventName, data, error: errorDetails };
}
