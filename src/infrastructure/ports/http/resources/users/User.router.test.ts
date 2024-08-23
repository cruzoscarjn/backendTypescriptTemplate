import express from 'express';

import HandlersHttp from '#infrastructure/ports/http/handlers.http';
import UserController from '#infrastructure/ports/http/resources/users/controllers/User.controller';
import UsersRoutes from '#infrastructure/ports/http/resources/users/Users.router';

jest.unmock('#infrastructure/ports/http/resources/users/Users.router');

jest.mock('express', () => ({
  Router: jest.fn().mockReturnValue({}),
}));

jest.mock('#infrastructure/ports/http/handlers.http', () => ({
  handleAndCatch: jest.fn((c) => c),
}));

describe('UsersRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly set up user routes', () => {
    express.Router().post = jest.fn();

    UsersRoutes.getRoutes();
    expect(express.Router().post).toHaveBeenCalledWith('/sign-up', HandlersHttp.handleAndCatch(UserController.signUp));
    expect(express.Router().post).toHaveBeenCalledWith('/sign-in', HandlersHttp.handleAndCatch(UserController.signIn));
    expect(express.Router().post).toHaveBeenCalledWith('/refresh-token', HandlersHttp.handleAndCatch(UserController.refreshToken));
    expect(express.Router().post).toHaveBeenCalledWith('/sign-out', HandlersHttp.handleAndCatch(UserController.signOut));
  });
});
