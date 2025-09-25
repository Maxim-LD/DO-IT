import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex("providers").del();

  // Insert core providers
  await knex("providers").insert([
    {
      id: uuidv4(),
      name: "email",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: "google",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: "facebook",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: "apple",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}
