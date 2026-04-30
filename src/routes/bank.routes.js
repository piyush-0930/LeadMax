const express = require("express");
const router = express.Router();

const {
  addBankAccount,
  getAccounts,
  deleteAccount,
  topUp,
} = require("../controllers/bank.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, addBankAccount);
router.get("/", protect, getAccounts);
router.delete("/:id", protect, deleteAccount);
router.post("/:id/topup", protect, topUp);

module.exports = router;