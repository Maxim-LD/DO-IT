import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("auth", (table) => {
    table.bigIncrements("sn").unsigned().primary();
    table.string('id', 36).notNullable().unique();
    table.bigInteger("user_sn").unsigned().notNullable();
    table.string("provider_id", 36).notNullable();
    table.string("identifier", 255).notNullable();
    table.string("secret", 255).notNullable();
    table.boolean("is_email_verified").notNullable();
    table.boolean("is_phone_verified").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable();

    // Unique constraint on provider_id + identifier
    table.unique(["provider_id", "identifier"], "auth_provider_id_identifier_unique");
        
    // Foreign key constraints
    table
      .foreign("provider_id", "auth_provider_id_foreign")
      .references("id")
      .inTable("providers")
      //.onDelete("CASCADE");

    table
      .foreign("user_sn", "auth_user_sn_foreign")
      .references("sn")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('auth')
}

