/* eslint-disable prefer-destructuring */

import EnvConfiguration, { Environment } from '../Env.configuration';

const getEnvMock = jest.fn<Environment, []>(() => ({
  LOG_LEVEL: 'info',
  IS_DEV: false,
  PORT: 3000,
  SESSION_TIME: 7,
  JWT_ISSUER: 'issuer',
  JWT_SECRET: 'secret',
  JWT_EXP_TIME: 3600,
  POSTGRES_DATABASE: 'database',
  POSTGRES_HOST: 'host',
  POSTGRES_PASSWORD: 'password',
  POSTGRES_PORT: 5432,
  POSTGRES_USER: 'user',
  SWAGGER_PORT: 3001,
  ALLOWED_ORIGINS: ['http://localhost:3001'],
}));

const EnvConfigurationMock: typeof EnvConfiguration = {
  getEnv: getEnvMock,
};

export default EnvConfigurationMock;
