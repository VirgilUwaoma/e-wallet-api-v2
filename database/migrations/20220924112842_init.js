/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user", function (table) {
      table.increments().primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("mobile_number").unique().notNullable();
      table.timestamps(true, true, false);
    })
    .createTable("wallet", function (table) {
      table.increments().primary();
      table.integer("user_id").unsigned().unique();
      table.decimal("balance", 9, 2);
      table.uuid("wallet_id").notNullable().unique();
      table
        .foreign("user_id")
        .references("user.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("transaction", function (table) {
      table.increments().primary();
      table.uuid("transaction_id").unique().notNullable();
      table.integer("sender_id").unsigned();
      table.integer("receiver_id").unsigned();
      table.decimal("amount", 9, 2).notNullable();
      table.boolean("successful").notNullable();
      table.enum("transaction_type", ["Fund", "Withdrawal", "Transfer"]);
      table.timestamp("transaction_time").defaultTo(knex.fn.now());
      table.foreign("sender_id").references("user.id");
      table.foreign("receiver_id").references("user.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("transaction")
    .dropTableIfExists("wallet")
    .dropTableIfExists("user");
};
