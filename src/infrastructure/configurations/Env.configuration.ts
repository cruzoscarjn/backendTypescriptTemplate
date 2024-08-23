/* eslint-disable prefer-destructuring */
import assert from 'assert';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface Environment {
  LOG_LEVEL: LogLevel;
  IS_DEV: boolean,
  PORT: number;
  SESSION_TIME: number;
  JWT_ISSUER: string;
  JWT_SECRET: string;
  JWT_EXP_TIME: number;
  POSTGRES_DATABASE: string;
  POSTGRES_HOST: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  SWAGGER_PORT: number;
  ALLOWED_ORIGINS: string[];
}

let envConfigurationSingleton: Environment;

function getEnv(reload = false): Environment {
  if (envConfigurationSingleton && !reload) return envConfigurationSingleton;

  dotenvExpand.expand(dotenv.config({ path: `${__dirname}/../../../.env` }));

  const allowedLogLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

  const {
    JWT_ISSUER,
    JWT_SECRET,
    POSTGRES_DATABASE,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER,
    SESSION_TIME,
    JWT_EXP_TIME,
    PORT,
    LOG_LEVEL,
    NODE_ENV,
    ALLOWED_ORIGINS,
  } = process.env;

  assert(JWT_ISSUER, 'env var JWT_ISSUER is required');
  assert(JWT_SECRET, 'env var JWT_SECRET is required');

  assert(POSTGRES_DATABASE, 'env var POSTGRES_DATABASE is required');
  assert(POSTGRES_HOST, 'env var POSTGRES_HOST is required');
  assert(POSTGRES_PASSWORD, 'env var POSTGRES_PASSWORD is required');
  assert(POSTGRES_PORT, 'env var POSTGRES_PORT is required');
  assert(POSTGRES_USER, 'env var POSTGRES_USER is required');
  assert(ALLOWED_ORIGINS, 'env var ALLOWED_ORIGINS is required');

  assert(allowedLogLevels.includes(LOG_LEVEL || ''), 'LOG_LEVEL must be one of fatal, error, warn, info, debug, trace');

  envConfigurationSingleton = {
    LOG_LEVEL: LOG_LEVEL as LogLevel,
    IS_DEV: NODE_ENV === 'development',
    PORT: Number.parseInt(PORT || '3000', 10),
    SESSION_TIME: Number.parseInt(SESSION_TIME || '7', 10),
    JWT_ISSUER,
    JWT_SECRET,
    JWT_EXP_TIME: Number.parseInt(JWT_EXP_TIME || '3600', 10),
    POSTGRES_DATABASE,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT: Number.parseInt(POSTGRES_PORT, 10),
    POSTGRES_USER,
    SWAGGER_PORT: Number.parseInt(process.env.SWAGGER_PORT || '3001', 10),
    ALLOWED_ORIGINS: ALLOWED_ORIGINS.split(','),
  };

  return envConfigurationSingleton;
}

const EnvConfiguration = {
  getEnv,
};

export default EnvConfiguration;
