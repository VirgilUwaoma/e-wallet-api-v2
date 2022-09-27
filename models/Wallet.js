const knex = require("../database/db-setup");

const getWalletByUserId = async function (userId) {
  wallet = await knex("wallet").where("user_id", userId);
  console.log(wallet);
  return wallet[0];
};

module.exports = { getWalletByUserId };
