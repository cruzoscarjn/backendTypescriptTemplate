import { HttpError } from '@utilities/HttpErrors';
import { ErrorRequestHandler } from 'express';
import { CustomRequest } from './LoggerMiddleware';

const errMessageContainsError = (message): boolean => message.search('message') > -1 && message.search('statusCode') > -1;

const getErrorMessage = ({
  statusCode, message, meta, error,
}): Error | HttpError => {
  const errorMessage = error || {
    message,
    statusCode,
    meta,
  };

  if (errMessageContainsError(message)) {
    return JSON.parse(message.match(/{.+?}/g)) || errorMessage;
  }

  return errorMessage;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorHandler: ErrorRequestHandler = (err, req: CustomRequest, res, _) => {
  const { logger = console } = req;
  const {
    statusCode = 500, message = 'Server error', meta, error,
  } = err;

  const errorMessage = getErrorMessage({
    statusCode, message, meta, error,
  });

  logger.error(`ERROR: ${JSON.stringify(errorMessage)}`);

  res.status(statusCode).send(errorMessage);
};
