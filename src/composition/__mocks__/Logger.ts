import pino from 'pino';

import Logger from '#composition/Logger';

const logFunctions = {
  info: jest.fn(),
  alert: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  fatal: jest.fn(),
};

const getLogger: typeof Logger.getLogger = jest.fn(() => logFunctions as unknown as pino.Logger);

export default {
  getLogger,
};
