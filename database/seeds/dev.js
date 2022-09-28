/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  await knex.raw("TRUNCATE TABLE user");
  await knex.raw("TRUNCATE TABLE wallet");
  await knex.raw("TRUNCATE TABLE transaction");

  await knex("user").insert([
    {
      id: 1,
      first_name: "user1",
      last_name: "test",
      email: "user1@seed.com",
      password: "$2b$10$oqUUOWOmwWPdw8aE2AThrO0jTrGCxtt7cM2A9zUSh5TwPvMjA4E9G",
      mobile_number: "1111111111",
    },
    {
      id: 2,
      first_name: "user2",
      last_name: "test",
      email: "user2@seed.com",
      password: "$2b$10$oqUUOWOmwWPdw8aE2AThrO0jTrGCxtt7cM2A9zUSh5TwPvMjA4E9G",
      mobile_number: "2222222222",
    },
  ]);

  await knex("wallet").insert([
    {
      id: 1,
      user_id: 1,
      balance: 100.0,
      wallet_id: uuidv4(),
    },
    {
      id: 2,
      user_id: 2,
      balance: 100.0,
      wallet_id: uuidv4(),
    },
  ]);
};
