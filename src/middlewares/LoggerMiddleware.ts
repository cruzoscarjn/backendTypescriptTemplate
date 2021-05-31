import { v4 as uuid } from 'uuid';
import { Logger, getLogger } from 'log4js';
import {
  Request, NextFunction, Response,
} from 'express';

export interface CustomRequest extends Request {
  logger: Logger;
  transactionId: string;
}

export function loggerMiddleware(req: CustomRequest, _: Response, next: NextFunction): void {
  const transactionId = uuid();
  const logger = getLogger(transactionId);

  req.logger = logger;
  req.transactionId = transactionId;

  logger.info(`${req.method} ${req.url}`);

  next();
}
