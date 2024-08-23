import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import AuthService from '#application/users/services/Auth.service';
import UserEntity from '#domain/users/User.entity';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

const {
  JWT_SECRET, JWT_ISSUER, JWT_EXP_TIME, SESSION_TIME,
} = EnvConfiguration.getEnv();

const msDay = 24 * 60 * 60 * 1000;

function createAccessToken(user: UserEntity): string {
  const accessToken = sign({
    sub: user.id,
    iss: JWT_ISSUER,
    exp: Math.floor(Date.now() / 1000) + JWT_EXP_TIME,
  }, JWT_SECRET);

  return accessToken;
}

function getSessionDate(): Date {
  return new Date(SESSION_TIME * msDay + Date.now());
}

function encryptPassword(password: string): Promise<string> {
  return hash(password, 10);
}

function validatePassword(password: string, encryptedPassword: string): Promise<boolean> {
  return compare(password, encryptedPassword);
}

const JWTAuthService: AuthService = {
  createAccessToken,
  getSessionDate,
  encryptPassword,
  validatePassword,
};

export default JWTAuthService;
