import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("tasks", (table) => {
        table.bigIncrements("sn").unsigned().primary();
        table.string('id', 36).notNullable().unique();
        table.string("user_id", 36).notNullable();
        table.string("title", 50).notNullable();
        table.text("description").nullable();

        table.string("time_frame", 50).notNullable();
        table.boolean("reminders").notNullable().defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable();
        table.string("reminder_frequency", 50).notNullable();
        table.boolean("is_active").notNullable().defaultTo(true);
        table.tinyint("progress_percentage").notNullable().defaultTo(0);
        
        // ENUM-like fields
        table.enum("repeat_interval", ['none', 'daily', 'weekly', 'monthly']).notNullable().defaultTo("none");
        table.enum("urgency_level", ['low', 'medium', 'high']).notNullable().defaultTo("medium");
        table.enum("status", ['ongoing', 'completed']).notNullable().defaultTo('ongoing'); // 'ongoing' or 'completed'

        // Index
        table.index(["title", "created_at"], "tasks_title_created_at_index");

        // Foreign key
        table
            .foreign("user_id", "tasks_user_id_foreign")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("tasks");
}
