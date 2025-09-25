import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements("sn").unsigned().primary();
        table.string('id', 36).notNullable().unique();
        table.string('fullname', 100).notNullable();
        table.string('email', 255).notNullable();
        table.string('username', 50).nullable();
        table.string('status', 50).nullable();
        table.string('occupation', 100).nullable();
        table.string('phone', 50).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
        table.date('date_of_birth').nullable();

        // Unique constraints
        table.unique(['email'], 'users_email_unique');
        table.unique(['username'], 'users_username_unique');
        table.unique(['phone'], 'users_phone_unique');

        // Index
        table.index('created_at', 'users_created_at_index');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

