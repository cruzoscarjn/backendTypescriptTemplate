import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import ErrorsHttp from '#infrastructure/ports/http/Errors.http';
import AuthMiddlewareHttp from '#infrastructure/ports/http/middlewares/Auth.middleware.http';

jest.unmock('#infrastructure/ports/http/middlewares/Auth.middleware.http');
jest.unmock('#infrastructure/ports/http/Errors.http');

jest.mock('#infrastructure/configurations/Env.configuration', () => ({
  getEnv: jest.fn(() => ({ JWT_SECRET: 'fake_jwt_secret' })),
}));

describe('AuthMiddlewareHttp', () => {
  let mockRequest: Request;
  const mockResponse = {} as Response;
  const mockNext = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request;
    jest.clearAllMocks();
  });

  describe('validateAccess', () => {
    it('should call next for whitelisted routes', () => {
      (mockRequest as {path: string}).path = '/users/sign-in';
      AuthMiddlewareHttp.validateAccess(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should throw Unauthorized error for no authorization header', () => {
      (mockRequest as {path: string}).path = '/protected/route';
      mockRequest.headers = {};
      expect(() => AuthMiddlewareHttp.validateAccess(mockRequest, mockResponse, mockNext))
        .toThrow(new ErrorsHttp.Unauthorized());
    });

    it('should throw BadRequest error for wrong auth schema', () => {
      mockRequest.headers = {
        authorization: 'worngSchema validtoken',
      };

      expect(() => AuthMiddlewareHttp.validateAccess(mockRequest, mockResponse, mockNext))
        .toThrow(new ErrorsHttp.BadRequest('wrong auth schema'));
    });

    it('should throw Unauthorized error for invalid token', () => {
      (verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });
      mockRequest.headers = { authorization: 'Bearer invalidtoken' };
      expect(() => AuthMiddlewareHttp.validateAccess(mockRequest, mockResponse, mockNext))
        .toThrow(new ErrorsHttp.Unauthorized('Invalid token'));
    });

    it('should call next and set req.authorization for valid token', () => {
      (verify as jest.Mock).mockReturnValue({ sub: 'user_id' });
      mockRequest.headers = { authorization: 'Bearer validtoken' };
      AuthMiddlewareHttp.validateAccess(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRequest.authorization).toEqual({ userId: 'user_id' });
    });
  });
});
