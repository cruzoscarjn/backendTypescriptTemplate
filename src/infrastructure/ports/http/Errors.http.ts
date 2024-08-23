/* eslint-disable max-classes-per-file */

export interface MetaError {
  [key: string]: unknown;
}

export interface Meta {
  errors?: MetaError[];
}

export class HttpError extends Error {
  statusCode: number;

  message: string;

  meta: Meta;

  constructor(message: string, statusCode = 500, meta: Meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.meta = meta;
  }
}

class Internal extends HttpError {
  constructor(message = 'Internal server error', statusCode = 500, meta: Meta = {}) {
    super(message, statusCode, meta);
  }
}

class Unauthorized extends Internal {
  constructor(message = 'Unauthorized', meta: Meta = {}) {
    super(message, 401, meta);
  }
}

class NotFound extends Internal {
  constructor(message = 'Not found', meta: Meta = {}) {
    super(message, 404, meta);
  }
}

class Forbidden extends Internal {
  constructor(message = 'Forbidden', meta: Meta = {}) {
    super(message, 403, meta);
  }
}

class Conflict extends Internal {
  constructor(message = 'Conflict', meta: Meta = {}) {
    super(message, 409, meta);
  }
}

class BadRequest extends Internal {
  constructor(message = 'Bad request', meta: Meta = {}) {
    super(message, 400, meta);
  }
}

const ErrorsHttp = {
  HttpError,
  Internal,
  Unauthorized,
  NotFound,
  Forbidden,
  Conflict,
  BadRequest,
};

export default ErrorsHttp;
