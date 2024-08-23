import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import UserEntity from '#domain/users/User.entity';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

import JWTAuthService from './JWTAuth.service';

jest.unmock('./JWTAuth.service');

describe('JWTAuthService', () => {
  describe('createAccessToken', () => {
    it('should return a valid JWT token', () => {
      const user = { id: '123' } as unknown as UserEntity;
      const token = JWTAuthService.createAccessToken(user);
      expect(sign).toHaveBeenCalled();
      expect(typeof token).toBe('string');
    });
  });

  describe('getSessionDate', () => {
    it('should return a correct future date', () => {
      const date = JWTAuthService.getSessionDate();
      const expectedDate = new Date(EnvConfiguration.getEnv().SESSION_TIME * 24 * 60 * 60 * 1000 + Date.now());
      expect(date).toEqual(expectedDate);
    });
  });

  describe('encryptPassword', () => {
    it('should return a hashed password', async () => {
      const password = 'testPassword';
      const hashedPassword = await JWTAuthService.encryptPassword(password);
      expect(hash).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).toBe('hashed');
    });
  });

  describe('validatePassword', () => {
    it('should validate a password against its hash', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashed';
      const isValid = await JWTAuthService.validatePassword(password, hashedPassword);
      expect(compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(isValid).toBe(true);
    });
  });
});
