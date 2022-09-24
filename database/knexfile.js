// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { knexSnakeCaseMappers } = require("objection");

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
    ...knexSnakeCaseMappers,
  },
};
