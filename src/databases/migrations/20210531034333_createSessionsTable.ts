import { Knex } from 'knex';

import { USERS, USER_SESSIONS } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto ');

  await knex.schema.createTable(USER_SESSIONS, (table: Knex.CreateTableBuilder) => {
    table.uuid('sessionId').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.bigInteger('userId').references('id').inTable(USERS).notNullable()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamp('expiresAt').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(USER_SESSIONS);
  await knex.raw('DROP EXTENSION IF EXISTS pgcrypto');
}
