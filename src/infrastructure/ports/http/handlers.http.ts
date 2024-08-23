import { Request, RequestHandler } from 'express';

import Logger from '#composition/Logger';

const logger = Logger.getLogger();

function handleAndCatch(handler: RequestHandler): RequestHandler {
  return async (req: Request, res, next): Promise<void> => {
    logger.info('got request');

    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

const HandlersHttp = {
  handleAndCatch,
};

export default HandlersHttp;
