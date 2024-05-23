const Account = require("../models/Account");
const Transfer = require("../models/Transfer");
const Entry = require("../models/Entry");

const Currencies = {
  USD: {
    Code: "USD",
    Name: "United States Dollar",
    Starter: "20",
  },
  NGN: {
    Code: "NGN",
    Name: "Nigerian Naira",
    Starter: "10",
  },
};

const checkAccountLimit = async (userId) => {
  const count = await Account.countDocuments({ user_id: userId });
  return count < 2;
};

const checkExistingAccount = async (userId, currency) => {
  const existingAccount = await Account.findOne({
    user_id: userId,
    currency: currency,
  });
  return existingAccount !== null;
};

const transferTx = async (tr) => {
  let tx = {};

  try {
    tx.transfer = await Transfer.create(tr);

    tx.to_account = await Account.findByIdAndUpdate(
      tr.to_account_id,
      { $inc: { balance: tr.amount } },
      { new: true }
    );

    tx.from_account = await Account.findByIdAndUpdate(
      tr.from_account_id,
      { $inc: { balance: -1 * tr.amount } },
      { new: true }
    );

    tx.entry_in = await Entry.create({
      account_id: tr.to_account_id,
      amount: tr.amount,
    });

    tx.entry_out = await Entry.create({
      account_id: tr.from_account_id,
      amount: -1 * tr.amount,
    });

    return tx;
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Encountered issue with transaction" });
  }
};

// Define the function to validate the request body
const validateRequestBody = (schema, body) => {
  const { error } = schema.validate(body);
  if (error) {
    const formattedError = error.details.reduce((acc, detail) => {
      return detail.message.replace(`"${detail.path[0]}"`, detail.path[0]);
    }, {});
    return formattedError;
  }
  return null;
};

const generateAccountNumber = (currency) => {
  const config = Currencies[currency];
  if (!config) {
    throw new Error("Currency not found");
  }

  const timestamp = Date.now(); // Get the current timestamp in milliseconds
  const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999

  const initialValue = config.Starter;
  const finalValue =
    timestamp.toString().slice(-4) + randomNumber.toString().padStart(4, "0");

  const accountNumber = initialValue + finalValue;
  // console.log(accountNumber);
  return accountNumber;
};

module.exports = {
  checkAccountLimit,
  checkExistingAccount,
  transferTx,
  validateRequestBody,
  generateAccountNumber,
  Currencies,
};
