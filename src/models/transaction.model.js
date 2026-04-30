const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    senderAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    receiverAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);