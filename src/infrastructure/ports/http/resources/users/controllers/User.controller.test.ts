import { Request, Response } from 'express';

import UserService from '#application/users/services/User.Service';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';
import ErrorsHttp from '#infrastructure/ports/http/Errors.http';
import UserController from '#infrastructure/ports/http/resources/users/controllers/User.controller';
import SignInSchema from '#infrastructure/ports/http/resources/users/schemas/SignIn.schema';
import SignUpSchema from '#infrastructure/ports/http/resources/users/schemas/SignUp.schema';
import SchemasValidatorUtility from '#infrastructure/utilities/SchemasValidator.utility';

jest.unmock('#infrastructure/ports/http/resources/users/controllers/User.controller');
jest.unmock('#infrastructure/ports/http/Resources/users/schemas/SignUp.schema');
jest.unmock('#infrastructure/ports/http/Resources/users/schemas/SignIn.schema');
jest.unmock('#infrastructure/ports/http/Errors.http');

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should validate schema and create a new user', async () => {
      const mockUser = { email: 'test@example.com', name: 'Test User', password: 'password' };
      mockRequest.body = mockUser;
      UserService.signUp = jest.fn().mockResolvedValue(mockUser);

      await UserController.signUp(mockRequest as Request, mockResponse as Response);

      expect(SchemasValidatorUtility.schemasValidation).toHaveBeenCalledWith(SignUpSchema, mockUser);
      expect(UserService.signUp).toHaveBeenCalledWith({ email: mockUser.email, name: mockUser.name, password: mockUser.password });
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('signIn', () => {
    it('should validate schema and sign in a user', async () => {
      const mockUserCredentials = { email: 'test@example.com', password: 'password' };
      const mockAuthKeys = { accessToken: 'access_token', sessionId: 'session_id' };
      mockRequest.body = mockUserCredentials;
      UserService.signIn = jest.fn().mockResolvedValue(mockAuthKeys);

      await UserController.signIn(mockRequest as Request, mockResponse as Response);

      expect(SchemasValidatorUtility.schemasValidation).toHaveBeenCalledWith(SignInSchema, mockUserCredentials);
      expect(UserService.signIn).toHaveBeenCalledWith(mockUserCredentials);
      expect(mockResponse.cookie).toHaveBeenCalledWith('SESSION_ID', mockAuthKeys.sessionId, expect.any(Object));
      expect(mockResponse.send).toHaveBeenCalledWith({ accessToken: mockAuthKeys.accessToken });
    });

    it('should set no opts cookies on development', async () => {
      const mockUserCredentials = { email: 'test@example.com', password: 'password' };
      const mockAuthKeys = { accessToken: 'access_token', sessionId: 'session_id' };
      mockRequest.body = mockUserCredentials;
      UserService.signIn = jest.fn().mockResolvedValue(mockAuthKeys);
      (EnvConfiguration.getEnv as jest.Mock).mockReturnValue({ IS_DEV: true });

      await UserController.signIn(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalledWith('SESSION_ID', mockAuthKeys.sessionId, {});
    });
  });

  describe('signOut', () => {
    it('should clear the session cookie and sign out the user', async () => {
      mockRequest.cookies = { SESSION_ID: 'session_id' };
      mockRequest.authorization = { userId: 'user_id' };
      UserService.signOut = jest.fn().mockResolvedValue(undefined);

      await UserController.signOut(mockRequest as Request, mockResponse as Response);

      expect(UserService.signOut).toHaveBeenCalledWith({ sessionId: 'session_id', userId: 'user_id' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('SESSION_ID');
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw an error if the session cookie is not found', async () => {
      mockRequest.cookies = {};
      mockRequest.authorization = { userId: 'user_id' };

      await expect(UserController.signOut(mockRequest as Request, mockResponse as Response)).rejects.toThrow(new ErrorsHttp.NotFound('Session not found'));
      expect(mockResponse.clearCookie).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token for a user', async () => {
      const mockAccessToken = 'new_access_token';
      mockRequest.cookies = { SESSION_ID: 'session_id' };
      mockRequest.authorization = { userId: 'user_id' };
      UserService.refreshToken = jest.fn().mockResolvedValue(mockAccessToken);

      await UserController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(UserService.refreshToken).toHaveBeenCalledWith({ sessionId: 'session_id', userId: 'user_id' });
      expect(mockResponse.send).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });

    it('should throw an error if the session cookie is not found', async () => {
      mockRequest.cookies = {};

      await expect(UserController.refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(new ErrorsHttp.BadRequest('Session not found'));
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });
});
