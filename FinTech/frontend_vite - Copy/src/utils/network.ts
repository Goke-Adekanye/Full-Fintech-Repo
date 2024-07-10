const baseUrl = "https://ape-banking.onrender.com/api/v1";
// const baseUrl = "http://localhost:5000/api/v1";

export const authUrl = {
  register: baseUrl + "/auth" + "/register",
  login: baseUrl + "/auth" + "/login",
};

export const userUrl = {
  me: baseUrl + "/users" + "/me",
  updateUsername: baseUrl + "/users" + "/username",
};

export const accountUrl = {
  list: baseUrl + "/account",
  add: baseUrl + "/account" + "/create",
  transfer: baseUrl + "/account" + "/transfer",
  addMoney: baseUrl + "/account" + "/add-money",
  verifyAccountNumber: baseUrl + "/account" + "/get-account-by-number",
  transactions: baseUrl + "/account" + "/transactions",
  addBeneficiary: baseUrl + "/account" + "/add-beneficiary",
  beneficiaries: baseUrl + "/account" + "/beneficiaries",
  deleteBeneficiary: baseUrl + "/account" + "/delete-beneficiary",
};
