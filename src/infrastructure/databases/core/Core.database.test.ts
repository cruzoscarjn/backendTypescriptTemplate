import knex from 'knex';

import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

import CoreDatabase, { CoreDBConfiguration } from './Core.database';

jest.unmock('./Core.database');

describe('CoreDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfiguration', () => {
    it('should return the correct configuration object', () => {
      const mockEnv = {
        POSTGRES_DATABASE: 'testdb',
        POSTGRES_HOST: 'localhost',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'user',
      };

      (EnvConfiguration.getEnv as jest.Mock).mockReturnValue(mockEnv);

      const expectedConfig: CoreDBConfiguration = {
        host: 'localhost',
        database: 'testdb',
        user: 'user',
        password: 'password',
        port: 5432,
      };

      const config = CoreDatabase.getConfiguration();
      expect(config).toEqual(expectedConfig);
    });
  });

  describe('getClient', () => {
    it('should call knex with the correct configuration', () => {
      const mockConfig: CoreDBConfiguration = {
        host: 'localhost',
        database: 'testdb',
        user: 'user',
        password: 'password',
        port: 5432,
      };

      CoreDatabase.getConfiguration = jest.fn().mockReturnValue(mockConfig);
      const mockKnexInstance = {};
      (knex as unknown as jest.Mock<typeof knex>).mockReturnValue(mockKnexInstance as typeof knex);

      const client = CoreDatabase.getClient();

      expect(knex).toHaveBeenCalledWith({ client: 'pg', connection: mockConfig });
      expect(client).toBe(mockKnexInstance);
    });
  });
});
