import useAxios from "@/components/hooks/useAxios";
import useAddAccount from "@/pages/Account/hooks/useAddAccount";
import { accountUrl } from "@/utils/network";
import { useEffect, useState } from "react";
import { AccountType } from "@/utils/types";
import AccountCard from "@/components/common/accountCard";
import { Tab, TabContent } from "@/components/ui/tabs";

type props = {
  updateDefaultAccount: (account: AccountType) => void;
};

const Accounts = ({ updateDefaultAccount }: props) => {
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

  useEffect(() => {
    if (accounts.length > 0) updateDefaultAccount(accounts[defaultAccount]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, defaultAccount]);

  const completeOperation = () => {
    setState({ ...state, sendMoneyDialog: false, addMoneyDialog: false });
    getAccounts();
  };

  const getContent = () => {
    if (loading) return "Loading accounts";
    if (accounts.length === 0) return "No accounts found";
    return (
      <div className="grid grid-cols-3 gap-5 my-5">
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
      <div className="flex items-center justify-between mt-5">
        <h1 className="text-2xl font-light">Accounts</h1>
        {getAddAccount(completeOperation)}
      </div>

      <div className="mb-[68px]">{getContent()}</div>
      {accounts.length > 0 && (
        <>
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent
            isActive={activeTab}
            accounts={accounts}
            onComplete={completeOperation}
          />
        </>
      )}
    </div>
  );
};

export default Accounts;
