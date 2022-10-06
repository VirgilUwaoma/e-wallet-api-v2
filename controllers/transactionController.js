const Transaction = require("../models/Transaction");
const createError = require("http-errors");

async function getTrxs(req, res, next) {
  try {
    const transactions = await Transaction.getTrxs();
    if (transactions.length != 0) {
      return res
        .status(200)
        .json({ transactions: transactions, message: "transactions" });
    }
    return res.status(200).json({ message: "No transactions to return" });
  } catch (error) {
    return next(createError(500));
  }
}

async function userTransactions(req, res, next) {
  if (req.params.id != req.body.token.id)
    return next(
      createError(
        400,
        `Not authorised to view transactions on this wallet transactions, your user_id is - ${req.body.token.id}`
      )
    );
  try {
    const transactions = await Transaction.getUserTrxs(req.params.id);
    if (transactions.length != 0) {
      return res
        .status(200)
        .json({ transactions: transactions, message: "transactions" });
    }
    return res.status(200).json({ message: "No transactions to return" });
  } catch (error) {
    return next(createError(500));
  }
}

module.exports = { getTrxs, userTransactions };
