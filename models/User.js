const knex = require("../database/db-setup");
const { v4: uuidv4 } = require("uuid");

const getByEmail = async function (email) {
  const emails = await knex("user")
    .join("wallet", "user.id", "=", "wallet.user_id")
    .select(
      "user.id",
      "user.first_name",
      "user.last_name",
      "user.email",
      "user.password",
      "user.mobile_number",
      "wallet.wallet_id",
      "wallet.balance"
    )
    .where("email", email);
  return emails[0];
};
const searchByEmail = async function (email) {
  const mobiles = await knex("user").where("email", email);
  return mobiles[0];
};

const getByMobile = async function (mobile_number) {
  const mobiles = await knex("user").where("mobile_number", mobile_number);
  return mobiles[0];
};

const createUser = async function (newUser, newWallet) {
  return knex
    .transaction(function (trx) {
      knex
        .insert(newUser)
        .into("user")
        .transacting(trx)
        .then(function (ids) {
          newWallet.user_id = ids[0];
          return knex("wallet").insert(newWallet).transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function (inserts) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

const getUsers = async function () {
  const users = await knex("user")
    .join("wallet", "user.id", "=", "wallet.user_id")
    .select(
      "user.id",
      "user.first_name",
      "user.last_name",
      "user.email",
      "user.mobile_number",
      "wallet.wallet_id",
      "wallet.balance"
    )
    .orderBy("user.id");
  return users;
};
const getUser = async function (id) {
  const user = await knex("user")
    .join("wallet", "user.id", "=", "wallet.user_id")
    .select(
      "user.id",
      "user.first_name",
      "user.last_name",
      "user.email",
      "user.mobile_number",
      "wallet.wallet_id",
      "wallet.balance"
    )
    .where("user.id", id);
  return user;
};

module.exports = {
  getByEmail,
  getByMobile,
  createUser,
  getUsers,
  getUser,
  searchByEmail,
};
