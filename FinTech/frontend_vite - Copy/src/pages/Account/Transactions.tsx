import { useEffect, useState } from "react";
import { AccountType, TransactionType } from "@/utils/types";
import TransactionTable from "../../components/common/myTable";
import useAxios from "@/components/hooks/useAxios";
import { accountUrl } from "@/utils/network";
import LoadingSpinner from "@/components/common/loadingSpinner";

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
    <div className="mt-5">
      <h1 className="text-2xl font-light">Transaction History</h1>
      {loading ? (
        <LoadingSpinner className="text-orange-500" />
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
};

export default Transaction;
