import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';

import Logger from '#composition/Logger';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

import MainRouterHttp from './Main.router.http';
import AuthMiddlewareHttp from './middlewares/Auth.middleware.http';
import ContextMiddlewareHttp from './middlewares/Context.middleware.http';
import ErrorMiddlewareHttp from './middlewares/Error.middleware.http';
import loggingMiddleware from './middlewares/Logging.middleware.http';

const { PORT } = EnvConfiguration.getEnv();
const logger = Logger.getLogger();

function init(): void {
  const app = express();

  app.use(cors(
    { origin: ['http://localhost:3001'] },
  ));
  app.use(cookieParser());
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(ContextMiddlewareHttp.setRequestContext);
  app.use(loggingMiddleware.httpLogger);

  app.use(AuthMiddlewareHttp.validateAccess);

  app.use(MainRouterHttp.getRouter());

  app.use(ErrorMiddlewareHttp.catchRequest);

  app.listen(PORT, () => {
    logger.info(`server listening on ${PORT}`);
  });
}

export default {
  init,
};
