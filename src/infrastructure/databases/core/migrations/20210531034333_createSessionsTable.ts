import { Knex } from 'knex';

import TableNamesConfiguration from '#infrastructure/configurations/TableNames.configuration';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto ');

  await knex.schema.createTable(TableNamesConfiguration.USER_SESSIONS, (table: Knex.CreateTableBuilder) => {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.bigInteger('userId').references('id').inTable(TableNamesConfiguration.USERS).notNullable()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamp('expiresAt').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableNamesConfiguration.USER_SESSIONS);
  await knex.raw('DROP EXTENSION IF EXISTS pgcrypto');
}
