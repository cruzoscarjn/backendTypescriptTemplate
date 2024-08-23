import { Knex } from 'knex';

import TableNamesConfiguration from '#infrastructure/configurations/TableNames.configuration';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableNamesConfiguration.USERS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id');
    table.text('name').notNullable();
    table.text('email').unique().notNullable();
    table.text('password').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableNamesConfiguration.USERS);
}
