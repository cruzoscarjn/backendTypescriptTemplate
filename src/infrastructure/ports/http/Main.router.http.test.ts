import express from 'express';

import MainRouterHttp from '#infrastructure/ports/http/Main.router.http';
import UsersRoutes from '#infrastructure/ports/http/resources/users/Users.router';

jest.unmock('#infrastructure/ports/http/Main.router.http');

const useMokck = jest.fn();

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    use: useMokck,
  })),
}));

describe('MainRouterHttp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the correct routes', () => {
    MainRouterHttp.getRouter();

    expect(express.Router).toHaveBeenCalled();
    expect(express.Router().use).toHaveBeenCalledWith('/users', UsersRoutes.getRoutes());
  });
});
