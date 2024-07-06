import { useEffect, useState } from "react";
import { AccountType, TransactionType } from "@/utils/types";
import useAxios from "@/components/hooks/useAxios";
import { accountUrl } from "@/utils/network";
import LoadingSpinner from "@/components/common/loadingSpinner";
import TransactionTable from "@/components/common/myTable";

type props = {
  account: AccountType;
};

const Transaction = ({ account }: props) => {
  const [loading, setLoading] = useState(true);
  const { axiosHandler } = useAxios();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const getTransactions = async () => {
    const res = await axiosHandler<TransactionType[]>(
      accountUrl.transactions,
      "POST",
      { account_id: account._id },
      true
    );
    setLoading(false);
    if (res) {
      setTransactions(res);
    }
  };

  useEffect(() => {
    setLoading(true);
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="mt-3">
      <h4 className="mb-[12px]">Transactions</h4>
      {loading ? (
        <LoadingSpinner className="text-orange-500" />
      ) : transactions.length === 0 ? (
        <section className="flex h-10 items-start justify-center">
          <img src="Empty-Transaction.png" alt="" className="mt-10" />
        </section>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
};

export default Transaction;
