import { Knex } from 'knex';

import CoreDatabase, { CoreDBConfiguration } from '../Core.database';

const knexMethods = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(undefined),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
} as unknown as Knex;

const configMock: CoreDBConfiguration = {
  host: 'localhost',
  database: 'test',
  user: 'test',
  password: 'password',
  port: 5432,
};

const CoreDatabaseMock: typeof CoreDatabase = {
  getClient: jest.fn(() => knexMethods),
  getConfiguration: jest.fn(() => configMock),
};

export default CoreDatabaseMock;
