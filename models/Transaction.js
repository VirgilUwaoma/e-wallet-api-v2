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

module.exports = { fundTrx };
