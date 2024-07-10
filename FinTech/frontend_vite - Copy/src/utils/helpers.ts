import { AccountType, BeneficiaryType, TransactionType } from "./types";

export function formatCurrency(input: string): string {
  return `${parseInt(input).toLocaleString("en-US")}.00`;
}

export function formatAccountFormat(currency: string, balance: number): string {
  return `${currency} - ${formatCurrency(balance.toString())}`;
}

export function formatBeneficiaryFormat(
  email: string,
  account_no: number
): string {
  return `${email} - ${account_no}`;
}

export function getBeneficiarySelect(beneficiaries: BeneficiaryType[]) {
  return beneficiaries.map((beneficiary) => {
    // email: item.email,
    // account_no: item.account_no,
    const _temp = formatBeneficiaryFormat(
      beneficiary.email,
      beneficiary.account_no
    );
    return {
      key: _temp,
      value: _temp,
    };
  });
}

export const getAccountSelect = (
  accounts: AccountType[],
  moneyInfo = false
) => {
  return accounts.map((account) => {
    const _temp = moneyInfo
      ? formatAccountFormat(account.currency, account.balance)
      : account.currency;
    return {
      key: _temp,
      value: _temp,
    };
  });
};

// Helper function to group transactions by date
export const groupTransactionsByDate = (transactions: TransactionType[]) => {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, TransactionType[]>);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const year = date.getFullYear();
  const dayOfWeek = date
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  return `${day} ${month} ${year}, ${dayOfWeek}`;
};
