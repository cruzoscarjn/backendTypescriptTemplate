import knex, { Knex } from 'knex';

import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

export interface CoreDBConfiguration {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
}

function getConfiguration(): CoreDBConfiguration {
  const {
    POSTGRES_DATABASE,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER,
  } = EnvConfiguration.getEnv();

  const configuration = {
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
  };

  return configuration;
}

function getClient(): Knex {
  return knex({ client: 'pg', connection: getConfiguration() });
}

const CoreDatabase = {
  getConfiguration,
  getClient,
};

export default CoreDatabase;
