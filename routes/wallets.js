const express = require("express");
const { verifyToken } = require("../utilities/token");
const walletController = require("../controllers/walletController");

const router = express.Router();

router.post("/fund", verifyToken, walletController.fundWallet);
router.post("/withdraw", verifyToken, walletController.debitWallet);
// router.post("/transfer", verifyToken, walletController.transfer);

module.exports = router;
