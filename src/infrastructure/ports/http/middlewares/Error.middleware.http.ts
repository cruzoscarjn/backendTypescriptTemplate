import {
  NextFunction, Request, Response,
} from 'express';

import Cause from '#composition/Cause.type';
import Logger from '#composition/Logger';

import ErrorsHttp, { HttpError } from '../Errors.http';

const logger = Logger.getLogger();

function mapInternalErrorToHttp(err: Error): HttpError {
  const { cause } = err;

  switch (cause) {
    case Cause.CONFLICT:
      return new ErrorsHttp.Conflict(err.message);
    case Cause.FORBIDDEN:
      return new ErrorsHttp.Forbidden(err.message);
    case Cause.NOT_FOUND:
      return new ErrorsHttp.NotFound(err.message);
    case Cause.UNAUTHORIZED:
      return new ErrorsHttp.Unauthorized(err.message);
    default:
      return new ErrorsHttp.Internal('Internal server error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function catchRequest(err: HttpError | Error, req: Request, res: Response, _: NextFunction): void {
  logger.error(err);

  let errorHttp = err as HttpError;

  if (!(err instanceof HttpError)) {
    errorHttp = mapInternalErrorToHttp(err);
  }

  res.status(errorHttp.statusCode).send(errorHttp);
}

const ErrorMiddlewareHttp = {
  catchRequest,
};

export default ErrorMiddlewareHttp;
