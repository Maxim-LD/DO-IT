import knex from "knex"
import knexConfig from "./knexfile"

const environment = process.env.NODE_ENV || 'development'
console.log("Knex config:", knexConfig[environment]);

const db = knex(knexConfig[environment])

console.log("Current environment:", environment);


export default db