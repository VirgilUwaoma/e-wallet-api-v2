const async = require("async");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const Wallet = require("../models/Wallet");
const Transaction = require("../Models/Transaction");
const {
  debitValidation,
  creditValidation,
  transferValidation,
} = require("../utilities/validation");

function fundWallet(req, res, next) {
  async.waterfall(
    [
      function (callback) {
        const { error } = creditValidation(req.body);
        if (error) {
          const message = error.details[0].message;
          throw createError(400, `${message}`);
        }
        callback();
      },
      async function () {
        const wallet = await Wallet.getWalletByUserId(req.token.id);
        if (!wallet) throw createError(409, "user wallet not found");
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
        .json({ data: result, message: "wallet funded successfully" });
    }
  );
}

function debitWallet(req, res, next) {
  async.waterfall(
    [
      function (callback) {
        const { error } = debitValidation(req.body);
        if (error) {
          const message = error.details[0].message;
          throw createError(400, `${message}`);
        }
        callback();
      },
      async function () {
        const wallet = await Wallet.getWalletByUserId(req.token.id);
        if (!wallet) {
          throw createError(409, "user wallet not found");
        }
        if (wallet.balance < req.body.amount) {
          throw createError(409, "insufficient wallet balance");
        }
      },
      async function () {
        const transactionId = uuidv4();
        const transaction = {
          transaction_id: transactionId,
          sender_id: req.token.id,
          receiver_id: req.token.id,
          amount: req.body.amount,
          transaction_type: "Withdrawal",
          successful: true,
        };
        const newTransaction = await Transaction.withdrawTrx(transaction);
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
        .json({ data: result, message: "wallet debited successfully" });
    }
  );
}

function transfer(req, res, next) {
  async.waterfall(
    [
      function (callback) {
        const { error } = transferValidation(req.body);
        if (error) {
          const message = error.details[0].message;
          throw createError(400, `${message}`);
        }
        callback();
      },
      async function () {
        const sender = await Wallet.getWalletByUserId(req.token.id);
        const receiver = await Wallet.getWalletByMobile(req.body.receiver);
        if (!sender) {
          throw createError(409, "user wallet not found");
        }
        if (!receiver)
          throw createError(
            400,
            "receiver with that mobile number doesn't exist"
          );
        if (sender.id === receiver.id)
          throw createError(400, "cannot transfer to your own wallet");
        if (sender.balance < req.body.amount)
          throw createError(409, "insufficient wallet balance for transaction");
        return receiver;
      },
      async function (receiver) {
        const transactionId = uuidv4();
        const transaction = {
          transaction_id: transactionId,
          sender_id: req.token.id,
          receiver_id: receiver.id,
          amount: req.body.amount,
          transaction_type: "Transfer",
          successful: true,
        };
        const newTransfer = await Transaction.transferTrx(transaction);
        if (!newTransfer)
          throw createError(
            500,
            "transaction couldn't be completed. try again"
          );
        return {
          transaction_id: transactionId,
          amount: transaction.amount,
          receiver: receiver.mobile_number,
        };
      },
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ data: result, message: "transfer successful" });
    }
  );
}

async function getWallets(req, res, next) {
  wallets = await Wallet.getWallets();
  return res.status(200).json({ wallets: wallets, message: "wallets" });
}
module.exports = {
  fundWallet,
  debitWallet,
  transfer,
  getWallets,
};
