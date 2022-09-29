const express = require("express");
const transactionsController = require("../controllers/transactionController");

const router = express.Router();

router.get("", transactionsController.getTrxs);

module.exports = router;
