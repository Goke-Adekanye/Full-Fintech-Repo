import useAxios from "@/components/hooks/useAxios";
import { accountUrl } from "@/utils/network";
import { useEffect, useState } from "react";
import { AccountType } from "@/utils/types";
import AccountCard from "@/components/common/accountCard";
import { Tab, TabContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import useAddAccount from "@/components/hooks/useAddAccount";

const Accounts = () => {
  const [state, setState] = useState({
    sendMoneyDialog: false,
    addMoneyDialog: false,
  });
  const { getAddAccount } = useAddAccount();
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Accounts");
  const { axiosHandler } = useAxios();
  const [defaultAccount, setDefaultAccount] = useState(0);

  const getAccounts = async () => {
    setLoading(true);
    const res = await axiosHandler<AccountType[]>(
      accountUrl.list,
      "GET",
      null,
      true
    );
    setLoading(false);
    if (res) {
      setAccounts(res);
    }
  };

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeOperation = () => {
    setState({ ...state, sendMoneyDialog: false, addMoneyDialog: false });
    getAccounts();
  };

  const getContent = () => {
    if (loading)
      return (
        <div className="my-2">
          <Skeleton />
        </div>
      );
    if (accounts.length === 0)
      return (
        <section className="flex h-10 items-start justify-center">
          <img src="Empty-Account.png" alt="" className="mt-10" />
        </section>
      );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
        {accounts.map((account, index) => (
          <AccountCard
            {...account}
            isDefault={index === defaultAccount}
            onClick={() => setDefaultAccount(index)}
            key={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-start space-y-3 min-[375px]:flex-row min-[375px]:items-center min-[375px]:justify-between mt-5">
        <h2 className="font-light">Accounts</h2>
        {getAddAccount(completeOperation)}
      </div>

      <div className="mb-[68px]">{getContent()}</div>
      {accounts.length > 0 && (
        <>
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent
            isActive={activeTab}
            accounts={[accounts[defaultAccount]]}
            onComplete={completeOperation}
          />
        </>
      )}
    </div>
  );
};

export default Accounts;
