const knex = require("../database/db-setup");

const getWalletByUserId = async function (userId) {
  wallet = await knex("wallet").where("user_id", userId);
  return wallet[0];
};

const getWalletByMobile = async function (mobile_number) {
  wallet = await knex("wallet")
    .leftJoin("user", function () {
      this.on("user.id", "=", "wallet.user_id");
    })
    .where("user.mobile_number", mobile_number);
  return wallet[0];
};

const getWallets = async function () {
  wallets = await knex("wallet");
  return wallets;
};

module.exports = { getWalletByUserId, getWalletByMobile, getWallets };
