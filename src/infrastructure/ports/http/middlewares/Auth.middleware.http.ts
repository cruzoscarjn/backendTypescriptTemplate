import {
  NextFunction, Request,
  Response,
} from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

import ErrorsHttp from '../Errors.http';

const { JWT_SECRET } = EnvConfiguration.getEnv();

const whiteListedRoutes = ['/users/sign-in', '/users/sign-up'];

function validateAccess(req: Request, _: Response, next:NextFunction): void {
  const { headers: { authorization }, path } = req;

  if (whiteListedRoutes.includes(path)) return next();

  if (!authorization) throw new ErrorsHttp.Unauthorized();

  const [schema, token] = authorization.split(' ');

  if (schema.toLocaleLowerCase() !== 'bearer') {
    throw new ErrorsHttp.BadRequest('wrong auth schema');
  }

  try {
    const payload = verify(token, JWT_SECRET) as JwtPayload;

    req.authorization = { userId: payload.sub as string };

    return next();
  } catch (error) {
    throw new ErrorsHttp.Unauthorized((error as Error).message);
  }
}

const AuthMiddlewareHttp = {
  validateAccess,
};

export default AuthMiddlewareHttp;
