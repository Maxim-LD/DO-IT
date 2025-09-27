import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("providers", (table) => {
    table.bigIncrements("sn").unsigned().primary(); // surrogate PK
    table.uuid("id").notNullable().unique(); // external UUID reference
    table.enum("name", ["email", "google", "facebook", "apple"]).notNullable().unique();
    // table.json("config").nullable(); // optional: for client_id, scopes, etc.
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("providers");
}
