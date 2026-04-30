const BankAccount = require("../models/bankAccount.model");

// ADD BANK ACCOUNT (max 3)
exports.addBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await BankAccount.countDocuments({ user: userId });

    if (count >= 3) {
      return res
        .status(400)
        .json({ message: "Maximum 3 bank accounts allowed" });
    }

    const account = await BankAccount.create({
      user: userId,
      accountNumber: Date.now().toString(),
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER BANK ACCOUNTS
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find({
      user: req.user.id,
    });

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);

    if (!account || account.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Account not found" });
    }

    await account.deleteOne();

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TOP-UP BALANCE
exports.topUp = async (req, res) => {
  try {
    const { amount } = req.body;

    const account = await BankAccount.findById(req.params.id);

    if (!account || account.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amount;
    await account.save();

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};