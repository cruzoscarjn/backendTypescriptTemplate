import pino from 'pino';

import EnvConfiguration from '../infrastructure/configurations/Env.configuration';

import Logger from './Logger';

jest.unmock('./Logger');

jest.mock('pino', () => jest.fn().mockReturnValue({}));

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getLogger returns a singleton instance', () => {
    const firstInstance = Logger.getLogger();
    const secondInstance = Logger.getLogger();
    expect(firstInstance).toBe(secondInstance);
    expect(pino).toHaveBeenCalledTimes(1);
  });

  describe('Environment configuration', () => {
    it('Logger is configured for development environment', () => {
      (EnvConfiguration.getEnv as jest.Mock).mockReturnValue({ LOG_LEVEL: 'debug', IS_DEV: true });
      Logger.getLogger(true);
      expect(pino).toHaveBeenCalledWith({
        level: 'debug',
        hooks: expect.objectContaining({
          logMethod: expect.any(Function),
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });
    });

    it('Logger is configured for production environment', () => {
      (EnvConfiguration.getEnv as jest.Mock).mockReturnValue({ LOG_LEVEL: 'info', IS_DEV: false });
      Logger.getLogger(true);
      expect(pino).toHaveBeenCalledWith({
        level: 'info',
        hooks: expect.objectContaining({
          logMethod: expect.any(Function),
        }),
      });
    });
  });
});
