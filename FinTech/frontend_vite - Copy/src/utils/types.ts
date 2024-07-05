export interface UserType {
  _id: string;
  created_at: string;
  updated_at: string;
  email: string;
  username: string;
}

export type SignInResponseType = {
  token: string;
};

export type keyValuePair = {
  [key: string]: any;
};

export type SelectItemsType = keyValuePair & {
  helpText?: string;
  items?: keyValuePair[];
};

export interface AccountType {
  _id: string;
  balance: number;
  amount?: string;
  created_at: string;
  currency: string;
  account_no: string;
}

export interface VerifyAccountType extends AccountType {
  email: string;
  user_id: string;
}

export interface TransactionType {
  amount: number;
  created_at: string;
  _id: string;
}
