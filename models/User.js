const knex = require("../database/db-setup");
const { v4: uuidv4 } = require("uuid");

const getByEmail = async function (email) {
  const emails = await knex("user").where("email", email);
  return emails[0];
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
      console.log(inserts.length + " new user created");
      return true;
    })
    .catch(function (error) {
      return error;
    });
};

module.exports = {
  getByEmail,
  getByMobile,
  createUser,
};
