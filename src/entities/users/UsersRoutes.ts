import { BaseRequestHandler } from '@utilities/HttpUtils';
import { Router } from 'express';

import {
  refresh, signIn, signOut, signUp,
} from './controllers/AuthControllers';

const usersRoutes = Router();

usersRoutes.post('/sign-up', BaseRequestHandler(signUp));
usersRoutes.post('/sign-in', BaseRequestHandler(signIn));
usersRoutes.get('/refresh', BaseRequestHandler(refresh));
usersRoutes.post('/sign-out', BaseRequestHandler(signOut));

export default usersRoutes;
