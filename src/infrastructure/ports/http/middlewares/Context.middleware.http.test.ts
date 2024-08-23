import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import AsyncStorage from '#composition/AsyncStorage';
import ContextMiddlewareHttp from '#infrastructure/ports/http/middlewares/Context.middleware.http';

jest.unmock('#infrastructure/ports/http/middlewares/Context.middleware.http');

describe('ContextMiddlewareHttp', () => {
  const mockUuid = '1234-5678-91011-1213';
  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
  });

  describe('setRequestContext', () => {
    it('should call AsyncStorage.run with an object containing a uuid and call next', () => {
      const mockReq: Partial<Request> = {};
      const mockRes: Partial<Response> = {};

      AsyncStorage.run = jest.fn().mockImplementation((_, next) => next());

      ContextMiddlewareHttp.setRequestContext(mockReq as Request, mockRes as Response, mockNext);

      expect(uuidv4).toHaveBeenCalled();
      expect(AsyncStorage.run).toHaveBeenCalledWith({ id: mockUuid }, expect.any(Function));
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
