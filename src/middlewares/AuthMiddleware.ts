import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError } from '@utilities/HttpErrors';

const {
  JWT_SECRET,
} = process.env;

export function validateAccess(req: Request, res: Response, next:NextFunction): void {
  const { headers: { authorization } } = req;

  if (!authorization) throw new UnauthorizedError();

  const [schema, token] = authorization.split(' ');

  if (schema.toLocaleLowerCase() !== 'bearer') {
    throw new BadRequestError('wrong auth schema');
  }

  try {
    verify(token, JWT_SECRET);

    next();
  } catch (error) {
    throw new UnauthorizedError(error.message);
  }
}
