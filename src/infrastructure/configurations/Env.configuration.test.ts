import EnvConfiguration from './Env.configuration';

jest.unmock('./Env.configuration');
jest.unmock('assert');

describe('EnvConfiguration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const requiredEnvVars = [
    'JWT_ISSUER', 'JWT_SECRET', 'POSTGRES_DATABASE', 'POSTGRES_HOST',
    'POSTGRES_PASSWORD', 'POSTGRES_PORT', 'POSTGRES_USER', 'LOG_LEVEL',
    'ALLOWED_ORIGINS',
  ];

  describe('Required environment variables', () => {
    test.each(requiredEnvVars)('%s is required', (varName) => {
      delete process.env[varName];
      expect(() => EnvConfiguration.getEnv(true)).toThrow();
    });
  });

  describe('Environment variable parsing', () => {
    beforeEach(() => {
      process.env = {
        ...process.env,
        JWT_ISSUER: 'issuer',
        JWT_SECRET: 'secret',
        POSTGRES_DATABASE: 'database',
        POSTGRES_HOST: 'host',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_PORT: '5432',
        POSTGRES_USER: 'user',
        SESSION_TIME: '7',
        JWT_EXP_TIME: '3600',
        PORT: '3000',
        LOG_LEVEL: 'info',
        NODE_ENV: 'development',
        SWAGGER_PORT: '3001',
        ALLOWED_ORIGINS: 'http://localhost:3001',
      };
    });

    it('correctly parses environment variables', () => {
      const env = EnvConfiguration.getEnv();
      expect(env).toEqual(expect.objectContaining({
        JWT_ISSUER: 'issuer',
        JWT_SECRET: 'secret',
        POSTGRES_DATABASE: 'database',
        POSTGRES_HOST: 'host',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'user',
        SESSION_TIME: 7,
        JWT_EXP_TIME: 3600,
        PORT: 3000,
        LOG_LEVEL: 'info',
        IS_DEV: true,
        SWAGGER_PORT: 3001,
        ALLOWED_ORIGINS: ['http://localhost:3001'],
      }));
    });

    it('should handle defaults', () => {
      delete process.env.PORT;
      delete process.env.SESSION_TIME;
      delete process.env.JWT_EXP_TIME;
      delete process.env.SWAGGER_PORT;

      const env = EnvConfiguration.getEnv(true);
      expect(env).toEqual(expect.objectContaining({
        PORT: 3000,
        SESSION_TIME: 7,
        JWT_EXP_TIME: 3600,
        SWAGGER_PORT: 3001,
      }));
    });

    it('should throw an error if LOG_LEVEL is not one of the allowed values', () => {
      process.env.LOG_LEVEL = 'invalid';
      expect(() => EnvConfiguration.getEnv(true)).toThrow('LOG_LEVEL must be one of fatal, error, warn, info, debug, trace');
    });
  });

  describe('Singleton behavior', () => {
    test('returns the same instance on subsequent calls', () => {
      const firstCall = EnvConfiguration.getEnv();
      const secondCall = EnvConfiguration.getEnv();
      expect(firstCall).toBe(secondCall);
    });
  });
});
