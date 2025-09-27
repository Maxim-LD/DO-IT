import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", (table) => {
    table.bigIncrements("sn").unsigned().primary(); // internal PK
    table.uuid("id").notNullable().unique();        // external UUID

    // Link to user (use surrogate PK instead of UUID for FK consistency)
    table.bigInteger("user_sn").unsigned().notNullable();

    table.string("title", 100).notNullable();
    table.text("description").nullable();

    // Time & reminders
    table.string("time_frame", 50).notNullable();
    table.boolean("reminders").notNullable().defaultTo(true);
    table.string("reminder_frequency", 50).notNullable();

    // Task status & progress
    table.integer("progress_percentage").unsigned().notNullable().defaultTo(0); // tinyint not directly supported in knex
    table.enum("repeat_interval", ["none", "daily", "weekly", "monthly"]).notNullable().defaultTo("none");
    table.enum("urgency_level", ["low", "medium", "high"]).notNullable().defaultTo("medium");
    table.enum("status", ["ongoing", "completed"]).notNullable().defaultTo("ongoing");

    table.boolean("is_active").notNullable().defaultTo(true);

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable();

    // Indexes
    table.index(["title", "created_at"], "tasks_title_created_at_index");

    // Foreign key
    table
      .foreign("user_sn", "tasks_user_sn_foreign")
      .references("sn")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tasks");
}
