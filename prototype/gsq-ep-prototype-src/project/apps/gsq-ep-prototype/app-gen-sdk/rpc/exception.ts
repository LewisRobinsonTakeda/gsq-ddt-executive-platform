/* eslint-disable eslint-comments/no-restricted-disable */
/* eslint-disable */

/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

export class Exception {
  private _type: string;
  private _code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: any;
  private _stackTrace: string;
  private _message: string;
  private _innerException: Exception | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    type: string,
    code: string,
    message: string,
    data?: any,
    innerException?: Exception,
  ) {
    const error = data && data instanceof Error ? data : new Error(message);

    if (!type) {
      throw new ArgumentException('Type cannot be empty for exception');
    }
    this._type = type;

    if (!code) {
      throw new ArgumentException('Code cannot be empty for exception');
    }
    this._code = code;

    if (!message) {
      throw new ArgumentException('Message cannot be empty for exception');
    }
    this._message = message;

    this._data = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._stackTrace = (error as any).stack;
    this._innerException = innerException;
  }

  get type(): string {
    return this._type;
  }

  get code(): string {
    return this._code;
  }

  get stackTrace(): string {
    return this._stackTrace;
  }

  get message(): string {
    return this._message;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data(): any {
    return this._data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get innerException(): any {
    return this._innerException;
  }
}

export class UnknownException extends Exception {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any) {
    super('UnknownException', 'UnknownException', 'Unknown error.', data);
  }
}

export class RpcException extends Exception {
  constructor(code: string, message: string, innerException?: Exception) {
    super('RpcException', code, message, undefined, innerException);
  }
}

export class ArgumentException extends Exception {
  constructor(message: string) {
    super('ArgumentException', 'ArgumentException', message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToException(error: any): Exception {
  if (
    error instanceof Error ||
    (error.name && error.message && !error.hasOwnProperty('_stackTrace'))
  ) {
    return new Exception('ErrorException', 'Error', error.message, error);
  } else if (
    error.type &&
    error.code &&
    error.message &&
    error.hasOwnProperty('_stackTrace')
  ) {
    return error;
  } else {
    return new UnknownException(error);
  }
}

export async function withRpcError<T>(
  rpcOperation: () => Promise<T>,
): Promise<T> {
  try {
    return await rpcOperation();
  } catch (error: any) {
    // Capture the current stack trace for better debugging
    const currentStack = new Error().stack;

    // Extract the most meaningful error message
    let message: string;
    const originalError = error;

    if (error._innerException?._message) {
      message = error._innerException._message;
    } else if (error.message) {
      message = error.message;
    } else {
      message = `An error occurred during RPC operation`;
    }

    // Create a new error with enhanced context
    const newError = new Error(message);
    newError.stack = `${currentStack}\nCaused by: ${originalError.stack || originalError}`;
    throw newError;
  }
}
