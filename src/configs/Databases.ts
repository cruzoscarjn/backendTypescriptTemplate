import assert from 'assert';

const {
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} = process.env;

assert(POSTGRES_DATABASE, 'env var POSTGRES_DATABASE is required');
assert(POSTGRES_HOST, 'env var POSTGRES_HOST is required');
assert(POSTGRES_PASSWORD, 'env var POSTGRES_PASSWORD is required');
assert(POSTGRES_PORT, 'env var POSTGRES_PORT is required');
assert(POSTGRES_USER, 'env var POSTGRES_USER is required');

export default {
  main: {
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT, 10),
  },
};
