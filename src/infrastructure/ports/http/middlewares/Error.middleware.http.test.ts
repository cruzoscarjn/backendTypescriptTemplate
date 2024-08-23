import { NextFunction, Request, Response } from 'express';

import Cause from '#composition/Cause.type';
import ErrorsHttp from '#infrastructure/ports/http/Errors.http';
import ErrorMiddlewareHttp from '#infrastructure/ports/http/middlewares/Error.middleware.http';

jest.unmock('#infrastructure/ports/http/middlewares/Error.middleware.http');
jest.unmock('#infrastructure/ports/http/Errors.http');

describe('ErrorMiddlewareHttp', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;
  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HttpError correctly', () => {
    const error = new ErrorsHttp.NotFound('Not found error');
    ErrorMiddlewareHttp.catchRequest(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith(error);
  });

  it.each([
    [new Error('Conflict error', { cause: Cause.CONFLICT }), 409],
    [new Error('Forbidden error', { cause: Cause.FORBIDDEN }), 403],
    [new Error('Not found error', { cause: Cause.NOT_FOUND }), 404],
    [new Error('Unauthorized error', { cause: Cause.UNAUTHORIZED }), 401],
  ])('should map %s to HttpError with status %d', (error, expectedStatus) => {
    ErrorMiddlewareHttp.catchRequest(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('should default to Internal server error for unknown causes', () => {
    const error = new Error('Unknown error');
    ErrorMiddlewareHttp.catchRequest(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(expect.any(ErrorsHttp.Internal));
  });
});
