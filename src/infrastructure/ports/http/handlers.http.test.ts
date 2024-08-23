import { NextFunction, Request, Response } from 'express';

import HandlersHttp from '#infrastructure/ports/http/handlers.http';

jest.unmock('#infrastructure/ports/http/handlers.http');

describe('HandlersHttp', () => {
  describe('handleAndCatch', () => {
    it('should call the handler and catch any errors', async () => {
      const handler = jest.fn();
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await HandlersHttp.handleAndCatch(handler)(req, res, next);

      expect(handler).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call the next function if an error is thrown', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Test error'));
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await HandlersHttp.handleAndCatch(handler)(req, res, next);

      expect(handler).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(new Error('Test error'));
    });
  });
});
