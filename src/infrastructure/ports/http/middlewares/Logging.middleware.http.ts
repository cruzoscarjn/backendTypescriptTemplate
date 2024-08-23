import {
  NextFunction,
  Request,
  Response,
} from 'express';

import Logger from '#composition/Logger';

const logger = Logger.getLogger();

function httpLogger(req: Request, _: Response, next: NextFunction): void {
  logger.info(`${req.method} ${req.url}`);

  next();
}

const loggingMiddleware = {
  httpLogger,
};

export default loggingMiddleware;
