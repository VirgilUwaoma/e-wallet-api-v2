const express = require("express");
const { verifyToken } = require("../utilities/token");
const userController = require("../controllers/userController");
const walletController = require("../controllers/walletController");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/:id/fund", verifyToken, walletController.fundWallet);
router.post("/:id/withdraw", verifyToken, walletController.debitWallet);
router.post("/:id/transfer", verifyToken, walletController.transfer);
router.get(
  "/:id/transactions",
  verifyToken,
  transactionController.userTransactions
);

module.exports = router;
