import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';

import { db } from '@databases/Databases';
import { schemasValidation } from '@utilities/SchemasValidator';
import SignUpSchema from '@users/schemas/SignUpSchema';
import {
  BadRequestError, ConflictError, NotFoundError, UnauthorizedError,
} from '@utilities/HttpErrors';
import SignInSchema from '@users/schemas/SignInSchema';
import { User } from '@prisma/client';
import { createAccessToken, createSession } from '@users/services/UserServices';
import { AccessResponse } from '@users/types/AuthTypes';

const { NODE_ENV } = process.env;

type signInUser = Omit<User, 'name' | 'createdAt' | 'updatedAt' | 'id'>

export async function signUp(req: Request<unknown, User, User>, res: Response): Promise<Response<User>> {
  const { body } = req;

  schemasValidation(SignUpSchema, body);

  const existingUser = await db.user.findFirst({ where: { email: body.email } });

  if (existingUser) {
    throw new ConflictError('User with this email already exist');
  }

  const hashedPassword = await hash(body.password, 14);
  const user = await db.user.create({
    data: { ...body, password: hashedPassword },
    select: {
      id: true, name: true, createdAt: true, updatedAt: true,
    },
  });

  return res.send(user);
}

export async function signIn(req: Request<unknown, unknown, signInUser >, res: Response): Promise<Response<AccessResponse>> {
  const { body } = req;

  schemasValidation(SignInSchema, body);

  const { email, password } = body;

  const user = await db.user.findFirst({ where: { email } });

  if (!user) throw new NotFoundError('User not found');

  const isValid = await compare(password, user.password);

  if (!isValid) throw new BadRequestError('Invalid credentials');

  const accessToken = createAccessToken(user);

  const { sessionId } = await createSession(user);

  const cookieOpts = NODE_ENV === 'production' ? { secure: true, httpOnly: true, sameSite: true } : {};

  res.cookie('session', sessionId, cookieOpts);

  return res.send({
    userId: user.id,
    userEmail: user.email,
    accessToken,
  });
}

export async function refresh(req: Request, res: Response): Promise<Response<AccessResponse>> {
  const { cookies: { session: sessionId } } = req;

  if (!sessionId) throw new BadRequestError('Session cookie not found');

  const userSession = await db.userSession.findFirst({ where: { sessionId } });

  if (!userSession) throw new NotFoundError('Session not found');

  if (userSession.expiresAt.getTime() < Date.now()) {
    await db.userSession.delete({ where: { sessionId } });

    throw new UnauthorizedError('Session expired');
  }

  const user = await db.user.findFirst({ where: { id: userSession.userId } });

  const accessToken = createAccessToken(user);

  return res.send({
    userId: user.id,
    userEmail: user.email,
    accessToken,
  });
}

export async function signOut(req: Request, res: Response): Promise<Response> {
  const { cookies: { session: sessionId } } = req;

  if (!sessionId) throw new BadRequestError('Session cookie not found');

  await db.userSession.delete({ where: { sessionId } }).catch(() => {
    throw new NotFoundError('Session not found');
  });

  return res.send();
}
