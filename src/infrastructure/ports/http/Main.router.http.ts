import { Router } from 'express';

import UsersRouter from './resources/users/Users.router';

function getRouter(): Router {
  const router = Router();

  router.use('/users', UsersRouter.getRoutes());

  return router;
}

export default {
  getRouter,
};
