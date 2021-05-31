// eslint-disable-next-line max-classes-per-file
export interface ErrorMetaError {
  identifier?: string;
  description?: string;
  entity?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ErrorMeta {
  errors?: ErrorMetaError[];
  [key: string]: unknown;
}

export interface HttpErrorBase {
  statusCode?: number;
  message?: string;
  meta?: ErrorMeta;
}

export class HttpError extends Error {
  statusCode: number;

  message: string;

  meta: ErrorMeta;

  constructor(message: string, statusCode = 500, meta?: ErrorMeta) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.meta = meta;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', meta?: ErrorMeta) {
    super(message, 401, meta);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found', meta?: ErrorMeta) {
    super(message, 404, meta);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', meta?: ErrorMeta) {
    super(message, 403, meta);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', meta?: ErrorMeta) {
    super(message, 409, meta);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', meta?: ErrorMeta) {
    super(message, 400, meta);
  }
}
