const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const MoneyRecord = require("../models/MoneyRecord");
const Entry = require("../models/Entry");
const User = require("../models/User");
const {
  checkAccountLimit,
  checkExistingAccount,
  transferTx,
  validateRequestBody,
  generateAccountNumber,
  Currencies,
} = require("../utils/utils");
const Joi = require("joi");

const createAccount = async (req, res) => {
  req.body.user_id = req.user.userId;

  const { currency } = req.body;

  if (!currency || !Currencies[currency]) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide a valid currency" });
  }

  if (!(await checkAccountLimit(req.user.userId))) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Account limit exceeded" });
  }

  if (await checkExistingAccount(req.user.userId, currency)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "You already have an account with this currency" });
  }

  try {
    const account = await Account.create(req.body);
    const account_no = await generateAccountNumber(account.currency);

    const updatedAccount = await Account.findByIdAndUpdate(
      account._id,
      { account_no },
      { new: true }
    );

    const formattedResponse = {
      _id: updatedAccount._id,
      user_id: updatedAccount.user_id,
      account_no: updatedAccount.account_no,
      currency: updatedAccount.currency,
      balance: updatedAccount.balance,
      createdAt: updatedAccount.createdAt,
    };
    res.status(StatusCodes.CREATED).json({ account: formattedResponse });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "You already have an account with this currency" });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while creating the account" });
  }
};

const getUserAccounts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const accounts = await Account.find({ user_id: userId });
    res.status(StatusCodes.OK).json(accounts);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const sendMoneySchema = Joi.object({
  from_account_id: Joi.string().required(),
  to_account_no: Joi.number().required(),
  amount: Joi.number().required(),
});

const transferFund = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(sendMoneySchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const userId = req.user.userId;
    const tr = req.body;

    const fromAccount = await Account.findById(tr.from_account_id);
    if (!fromAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid Account" });
    }

    if (fromAccount.user_id.toString() !== userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Unauthorized Transaction" });
    }

    const toAccount = await Account.findOne({ account_no: tr.to_account_no });
    if (!toAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Recipient Account Not Found" });
    }
    // console.log(toAccount);
    // console.log(fromAccount);

    if (toAccount.currency !== fromAccount.currency) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Account Currencies Mismatch" });
    }

    if (fromAccount.balance < tr.amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Insufficient balance" });
    }

    let txArg = {
      from_account_id: tr.from_account_id,
      to_account_id: toAccount._id,
      amount: tr.amount,
    };

    const response = await transferTx(txArg);
    res.status(StatusCodes.CREATED).json(response);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Encountered issue with transaction" });
  }
};

const addMoneySchema = Joi.object({
  to_account_id: Joi.string().required(),
  amount: Joi.number().required(),
  reference: Joi.string().required(),
  status: Joi.string(),
});

// Define Add-money function
const addMoney = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(addMoneySchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const userId = req.user.userId;
    const { to_account_id, amount, reference, status } = req.body;

    const account = await Account.findById(to_account_id);
    if (!account) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Account not found" });
    }

    if (account.user_id.toString() !== userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized operation" });
    }

    const moneyRecordArgs = {
      user_id: account.user_id,
      reference,
      status,
      amount,
    };

    await MoneyRecord.create(moneyRecordArgs);

    const entryArgs = { account_id: account._id, amount };
    await Entry.create(entryArgs);

    await Account.findByIdAndUpdate(account._id, { $inc: { balance: amount } });
    res.status(StatusCodes.OK).json({ message: "Updated account balance" });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Record with reference already exists" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  }
};

// Define the schema for the request body
const GetAccountByAccountNoSchema = Joi.object({
  account_no: Joi.number().required(),
});

// Define the function to get an account by account number
const getAccountByAccountNumber = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(
      GetAccountByAccountNoSchema,
      req.body
    );
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    // const userId = req.user.userId;
    const { account_no } = req.body;

    const account = await Account.findOne({ account_no });

    if (!account) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Couldn't get account" });
    }

    const { user_id } = account;
    const accountOwner = await User.findById({ _id: user_id });

    // Format the response
    const formattedResponse = {
      _id: account._id,
      user_id: account.user_id,
      account_no: account.account_no,
      currency: account.currency,
      balance: account.balance,
      email: accountOwner.email,
      createdAt: account.createdAt,
    };

    return res.status(StatusCodes.OK).json(formattedResponse);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getTransactionSchema = Joi.object({
  account_id: Joi.string().required(),
});

const getTransactions = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(getTransactionSchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const userId = req.user.userId;
    const { account_id } = req.body;

    const account = await Account.findById(account_id);
    if (!account) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Account not found" });
    }

    if (account.user_id.toString() !== userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized operation" });
    }

    const transactions = await Entry.find({ account_id })
      .sort({ created_at: -1 })
      .limit(10);
    res.status(StatusCodes.OK).json(transactions);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

module.exports = {
  createAccount,
  getUserAccounts,
  transferFund,
  addMoney,
  getAccountByAccountNumber,
  getTransactions,
};
