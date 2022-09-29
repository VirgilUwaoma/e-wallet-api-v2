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

module.exports = { getTrxs };
