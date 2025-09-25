import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("providers", (table) => {
    table.bigIncrements("sn").unsigned().primary()
    table.string('id', 36).notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable()
    table.enum("name", ["email", "google", "facebook", "apple"]).notNullable().defaultTo("email");

    // Unique constraint
    table.unique(["name"], "providers_name_unique")

  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("providers")
}
