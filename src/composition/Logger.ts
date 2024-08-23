/* eslint-disable @typescript-eslint/no-explicit-any */

import pino, { LoggerOptions } from 'pino';

import AsyncStorage from '#composition/AsyncStorage';

import EnvConfiguration from '../infrastructure/configurations/Env.configuration';

let loggerSingleton: pino.Logger;

function getLogger(reload = false): pino.Logger {
  const { LOG_LEVEL, IS_DEV } = EnvConfiguration.getEnv();

  if (loggerSingleton && !reload) return loggerSingleton;

  const baseConfig: LoggerOptions = {
    level: LOG_LEVEL,
    hooks: {
      logMethod(inputArgs, method) {
        this.setBindings({ context: AsyncStorage.getStore() });
        method.apply(this, inputArgs);
      },
    },
  };

  const devOptions: LoggerOptions = {
    ...baseConfig,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  };

  loggerSingleton = pino(IS_DEV ? devOptions : baseConfig);

  return loggerSingleton;
}

export default {
  getLogger,
};
