import { validateAccess } from '@middlewares/AuthMiddleware';
import { Router } from 'express';
import UsersRouter from './entities/users/UsersRoutes';

const mainRouter = Router();

mainRouter.use('/users', UsersRouter);

// remove this when starting development
mainRouter.get('/test-auth-endpoint', validateAccess, (req, res) => { res.send('test'); });

export default mainRouter;
