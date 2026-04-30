const express = require("express");
const router = express.Router();

const {
  doPayment,
  getTransactions,
} = require("../controllers/payment.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, doPayment);
router.get("/", protect, getTransactions);

module.exports = router;