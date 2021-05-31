import { sign } from 'jsonwebtoken';

import { db } from '@databases/Databases';
import { User, UserSession } from '@prisma/client';

const {
  JWT_ISSUER, JWT_SECRET, JWT_EXP_TIME, SESSION_TIME,
} = process.env;

export async function createSession(user: User): Promise<UserSession> {
  const sessionDays = Number.parseInt(SESSION_TIME, 10) * 24 * 60 * 60 * 1000;

  const sessionExpiration = new Date(Date.now() + sessionDays);

  const session = await db.userSession.create({ data: { expiresAt: sessionExpiration, userId: user.id } });

  return session;
}

export function createAccessToken(user: User): string {
  const exp = Math.floor(Date.now() / 1000) + Number.parseInt(JWT_EXP_TIME, 10);

  const accessToken = sign({
    sub: user.id,
    iss: JWT_ISSUER,
    exp,
  }, JWT_SECRET);

  return accessToken;
}
