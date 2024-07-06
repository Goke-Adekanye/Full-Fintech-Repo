import { TransactionType } from "@/utils/types";
import { TransactionIcon } from "../auth/Icon";
import {
  formatCurrency,
  formatDate,
  groupTransactionsByDate,
} from "@/utils/helpers";

interface TransactionListProps {
  transactions: TransactionType[];
}

const TransactionTable: React.FC<TransactionListProps> = ({ transactions }) => {
  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <section className="rounded-md px-2 py-2">
      {Object.keys(groupedTransactions).map((date) => (
        <section key={date} className="mt-6">
          <section>
            <span className="block border-b border-b-thin-slate pb-1 text-[16px] max-[257px]:text-[10px] max-[350px]:text-sm text-[#696969]">
              {formatDate(date.toString())}
            </span>

            {groupedTransactions[date].map((transaction) => (
              <div
                className="my-5 grid grid-cols-3 align-middle"
                key={transaction._id}
              >
                <div className="col-span-2 flex items-center space-x-2">
                  <div>
                    <TransactionIcon />
                  </div>
                  <div className="max-[257px]:text-[7px] max-[350px]:text-[9px] text-[11px]">
                    <span className="block leading-loose">
                      {transaction.amount > 0 ? "CREDIT" : "DEBIT"}
                    </span>
                    <span className="block">{transaction._id}</span>
                  </div>
                </div>
                <span
                  className={`block text-end max-[350px]:text-[12px] text-sm ${
                    transaction.amount > 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {formatCurrency(transaction.amount.toString())}
                </span>
              </div>
            ))}
          </section>
        </section>
      ))}
    </section>
  );
};

export default TransactionTable;
