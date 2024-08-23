import { Router } from 'express';

import HandlersHttp from '../../handlers.http';

import UserController from './controllers/User.controller';

function getRoutes(): Router {
  const usersRoutes = Router();

  usersRoutes.post('/sign-up', HandlersHttp.handleAndCatch(UserController.signUp));
  usersRoutes.post('/sign-in', HandlersHttp.handleAndCatch(UserController.signIn));
  usersRoutes.post('/refresh-token', HandlersHttp.handleAndCatch(UserController.refreshToken));
  usersRoutes.post('/sign-out', HandlersHttp.handleAndCatch(UserController.signOut));

  return usersRoutes;
}

const UsersRoutes = {
  getRoutes,
};

export default UsersRoutes;
