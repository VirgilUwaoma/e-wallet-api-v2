const knex = require("../database/db-setup");

const fundTrx = async function (transaction) {
  return knex
    .transaction(function (trx) {
      knex("wallet")
        .where("user_id", transaction.receiver_id)
        .update({
          balance: knex.raw("?? + ?", ["balance", transaction.amount]),
        })
        .transacting(trx)
        .then(function () {
          return knex("transaction").insert(transaction).transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function (update) {
      return update;
    })
    .catch(function (error) {
      console.error(error);
      return false;
    });
};

const withdrawTrx = async function (transaction) {
  return knex
    .transaction(function (trx) {
      knex("wallet")
        .where("user_id", transaction.receiver_id)
        .update({
          balance: knex.raw("?? - ?", ["balance", transaction.amount]),
        })
        .transacting(trx)
        .then(function () {
          return knex("transaction").insert(transaction).transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function (update) {
      return update;
    })
    .catch(function (error) {
      console.error(error);
      return error;
    });
};

const transferTrx = async function (transaction) {
  return knex
    .transaction(function (trx) {
      knex("transaction")
        .insert(transaction)
        .transacting(trx)
        .then(function () {
          console.log("UPDATING SENDER");
          return knex("wallet")
            .where("user_id", transaction.sender_id)
            .update({
              balance: knex.raw("?? - ?", ["balance", transaction.amount]),
            })
            .transacting(trx);
        })
        .then(function () {
          return knex("wallet")
            .where("user_id", transaction.receiver_id)
            .update({
              balance: knex.raw("?? + ?", ["balance", transaction.amount]),
            })
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function () {
      return true;
    })
    .catch(function (error) {
      console.error(error);
      return false;
    });
};

const getTrxs = async function () {
  transactions = await knex("transaction").orderBy("id", "desc");
  return transactions;
};

module.exports = { fundTrx, withdrawTrx, transferTrx, getTrxs };
