const BankAccount = require("../models/bankAccount.model");
const Transaction = require("../models/transaction.model");

// DO PAYMENT
exports.doPayment = async (req, res) => {
  try {
    const { senderAccountId, receiverAccountId, amount } = req.body;

    const sender = await BankAccount.findById(senderAccountId);
    const receiver = await BankAccount.findById(receiverAccountId);

    // validate accounts
    if (!sender || !receiver) {
      await Transaction.create({
        senderAccount: senderAccountId,
        receiverAccount: receiverAccountId,
        amount,
        status: "FAILED",
      });

      return res.status(400).json({ message: "Invalid accounts" });
    }

    // ownership check (VERY IMPORTANT)
    if (sender.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized sender account" });
    }

    // check balance
    if (sender.balance < amount) {
      await Transaction.create({
        senderAccount: senderAccountId,
        receiverAccount: receiverAccountId,
        amount,
        status: "FAILED",
      });

      return res.status(400).json({ message: "Insufficient balance" });
    }

    // SUCCESS FLOW
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      senderAccount: senderAccountId,
      receiverAccount: receiverAccountId,
      amount,
      status: "SUCCESS",
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TRANSACTIONS (by user)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("senderAccount receiverAccount");

    // filter user's transactions
    const userTransactions = transactions.filter(
      (tx) =>
        tx.senderAccount.user.toString() === req.user.id ||
        tx.receiverAccount.user.toString() === req.user.id
    );

    res.json(userTransactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};