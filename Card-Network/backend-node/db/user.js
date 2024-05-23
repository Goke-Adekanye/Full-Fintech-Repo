const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
});

const User = mongoose.model("User", userSchema);

const GetUser = async (rqx) => {
  const user = await User.findOne({ email: rqx.email });
  let userFound = false;
  if (user) {
    userFound = true;
    return { user, userFound };
  }

  return { user, userFound };
};

const CreateUser = async (body) => {
  const { user, userFound } = await GetUser(body);
  if (userFound) {
    const error = new Error("User already exists");
    error.statusCode = StatusCodes.BAD_REQUEST; // Set the status code
    throw error;
  }

  const newUser = await User.create(body);
  return newUser;
};

module.exports = { GetUser, CreateUser };
