import { Request, Response } from 'express';

import Logger from '#composition/Logger';
import loggingMiddleware from '#infrastructure/ports/http/middlewares/Logging.middleware.http';

jest.unmock('#infrastructure/ports/http/middlewares/Logging.middleware.http');

describe('loggingMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('httpLogger', () => {
    it('should log the correct information and call next', () => {
      const req = {
        method: 'GET',
        url: '/test-url',
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      loggingMiddleware.httpLogger(req, res, next);

      expect(Logger.getLogger().info).toHaveBeenCalledWith('GET /test-url');
      expect(next).toHaveBeenCalled();
    });
  });
});
