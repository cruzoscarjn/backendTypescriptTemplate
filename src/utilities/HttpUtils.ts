import { RequestHandler } from 'express';

import { CustomRequest } from '@middlewares/LoggerMiddleware';

export function BaseRequestHandler(handler: RequestHandler): RequestHandler {
  return async (req: CustomRequest, res, next): Promise<void> => {
    const { logger = console } = req;
    const section = 'BaseRequestHandler';
    logger.info(section, 'got request');

    try {
      await handler(req, res, next);
    } catch (err) {
      logger.error(section, 'threw error', err);
      next(err);
    }
  };
}
