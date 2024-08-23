import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';

import Logger from '#composition/Logger';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';
import RouterHttp from '#infrastructure/ports/http/Main.router.http';
import AuthMiddlewareHttp from '#infrastructure/ports/http/middlewares/Auth.middleware.http';
import ContextMiddlewareHttp from '#infrastructure/ports/http/middlewares/Context.middleware.http';
import ErrorMiddlewareHttp from '#infrastructure/ports/http/middlewares/Error.middleware.http';
import loggingMiddleware from '#infrastructure/ports/http/middlewares/Logging.middleware.http';
import PortHttp from '#infrastructure/ports/http/Port.http';

const use = jest.fn();
const listen = jest.fn((port, cb) => cb());

jest.unmock('#infrastructure/ports/http/Port.http');

jest.mock('express', () => {
  const appMock = jest.fn(() => ({
    use,
    listen,
  }));

  (appMock as unknown as typeof express).json = jest.fn();
  (appMock as unknown as typeof express).urlencoded = jest.fn();

  return appMock;
});

describe('PortHttp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set up the necessary middlewares', () => {
    PortHttp.init();

    expect(use).toHaveBeenCalledTimes(9);
    expect(use).toHaveBeenCalledWith(cookieParser());
    expect(use).toHaveBeenCalledWith(cors({ origin: EnvConfiguration.getEnv().ALLOWED_ORIGINS }));
    expect(use).toHaveBeenCalledWith(urlencoded({ extended: true }));
    expect(use).toHaveBeenCalledWith(json());
    expect(use).toHaveBeenCalledWith(ContextMiddlewareHttp.setRequestContext);
    expect(use).toHaveBeenCalledWith(loggingMiddleware.httpLogger);
    expect(use).toHaveBeenCalledWith(AuthMiddlewareHttp.validateAccess);
    expect(use).toHaveBeenCalledWith(ErrorMiddlewareHttp.catchRequest);
    expect(use).toHaveBeenCalledWith(RouterHttp.getRouter());
    expect(listen).toHaveBeenCalledWith(EnvConfiguration.getEnv().PORT, expect.any(Function));
    expect(Logger.getLogger().info).toHaveBeenCalledTimes(1);
  });
});
