import { configure } from 'log4js';

export function initLogger(logLvl: string): void {
  configure({
    appenders: {
      out: {
        type: 'stdout',
      },
    },
    categories: { default: { appenders: ['out'], level: logLvl } },
  });
}
