import { v4 } from 'uuid';

import { logWarning } from './logger-client';

// `logWarning` reaches the RPC client, which can throw synchronously in
// environments where `window` isn't available (unit tests, workers). Telemetry
// failures must not swallow or replace the real operation error.
function safeLogWarning(eventName: string, data: object): void {
  try {
    logWarning(eventName, data);
  } catch {
    /* telemetry unavailable */
  }
}

interface RetryOptions {
  // Non-idempotent callers (create/update/delete) must pass `maxAttempts: 1`
  // to opt out of retries — the retriable-error substring heuristic can match
  // status codes like '503' or '429' in surfaced upstream messages, so
  // retrying a non-idempotent operation on those can duplicate writes.
  maxAttempts?: number;
  baseDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  backoffMultiplier: 2,
};

function isRetriableError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  const errorMessage =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  const retriableErrorPatterns = [
    'sql timeout expired',
    'Initialization of the database connection or transaction failed.',
    'Connection State is closed',
    'Database is currently unavailable.',
    'Sql error: Generic SQL error. CRM ErrorCode: -2147204784',
    'the request was not sent or there was no response from the server. check your internet connection.',
    'More than one concurrent Delete requests detected for an Entity',
    '502',
    '503',
    '504',
    '429',
    // '401' is deliberately excluded — a 401 means the token is invalid/expired,
    // which won't recover without a re-auth step that withRetry doesn't do.
    // Retrying just adds ~3s of backoff before the failure surfaces.
  ];

  return retriableErrorPatterns.some((pattern) =>
    errorMessage.includes(pattern.toLowerCase()),
  );
}

function calculateBackoffDelay(
  attempt: number,
  options: Required<RetryOptions>,
): number {
  return options.baseDelayMs * Math.pow(options.backoffMultiplier, attempt - 1);
}

/**
 * **Calling convention**: `isRetriableError` substring-matches the thrown
 * `error.message` against patterns like `'503'` and `'CRM ErrorCode: …'`,
 * so once a real upstream message reaches this function it can match and
 * retry. Non-idempotent callers (create / update / delete) MUST pass
 * `{ maxAttempts: 1 }` to opt out — see the mutation methods in
 * `byoc-sdk-data-client.ts` for the pattern. Idempotent reads can rely on
 * the default `maxAttempts: 3`.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  options?: RetryOptions,
): Promise<T> {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  const operationId = v4();

  for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const shouldRetry =
        attempt < retryOptions.maxAttempts && isRetriableError(error);

      if (!shouldRetry) {
        safeLogWarning(`withRetry/${operationName}/RetryExhausted`, {
          operationId,
          attempt,
          maxAttempts: retryOptions.maxAttempts,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }

      const delayMs = calculateBackoffDelay(attempt, retryOptions);

      safeLogWarning(`withRetry/${operationName}/Retry`, {
        operationId,
        attempt,
        maxAttempts: retryOptions.maxAttempts,
        delayMs,
        error: error instanceof Error ? error.message : String(error),
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
