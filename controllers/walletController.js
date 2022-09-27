const Wallet = require("../models/Wallet");
const { v4: uuidv4 } = require("uuid");
const async = require("async");
const createError = require("http-errors");
const { fundWalletValidation } = require("../utilities/validation");
const Transaction = require("../Models/Transaction");

function fundWallet(req, res, next) {
  const { error } = fundWalletValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ message });
  }

  async.waterfall(
    [
      async function () {
        const wallet = await Wallet.getWalletByUserId(req.token.id);
        if (!wallet) {
          throw createError(409, "user wallet not found");
        }
      },
      async function () {
        const transactionId = uuidv4();
        const transaction = {
          transaction_id: transactionId,
          sender_id: req.token.id,
          receiver_id: req.token.id,
          amount: req.body.amount,
          transaction_type: "Fund",
          successful: true,
        };
        const newTransaction = await Transaction.fundTrx(transaction);
        if (!newTransaction) {
          throw createError(
            500,
            "transaction couldn't be completed. try again"
          );
        }
        return transactionId;
      },
      async function (transactionId) {
        const wallet = await Wallet.getWalletByUserId(req.token.id);
        const { user_id, balance, wallet_id } = wallet;
        return { user_id, wallet_id, balance, transactionId };
      },
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ data: result, message: "wallet funded sucessfully" });
    }
  );
}

module.exports = {
  fundWallet,
};
