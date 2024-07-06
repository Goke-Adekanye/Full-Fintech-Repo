// import { ReceiptText } from "lucide-react";
import useSendMoney from "../hooks/useSendMoney";
import useAddMoney from "@/pages/Account/hooks/useAddMoney";
import { AccountType } from "@/utils/types";
import Transaction from "@/pages/Account/Transactions";

interface TabProps {
  activeTab: string;
  setActiveTab: (arg0: string) => void;
}

interface TabContentProps {
  isActive: string;
  accounts: AccountType[];
  onComplete: () => void;
}
interface TabActionProps {
  accounts: AccountType[];
  onComplete: () => void;
}

const Tablist = ["Accounts", "Transactions", "Beneficiaries"];

function Tab({ activeTab, setActiveTab }: TabProps) {
  return (
    <section className="-mb-px flex md:w-2/3 w-full space-x-8 rounded-md bg-auth-section p-2 overflow-x-auto no-scrollbar">
      {Tablist.map((item) => (
        <section
          className={`${
            activeTab === item ? "text-auth-link bg-auth-lighter" : ""
          } flex w-auto md:w-1/3 cursor-pointer transition-all duration-500  items-center justify-center space-x-2 whitespace-nowrap rounded-md p-3 text-center text-xs font-semibold`}
          onClick={() => setActiveTab(item)}
          key={item}
        >
          {item}
        </section>
      ))}
    </section>
  );
}

function TabContent({ isActive, accounts, onComplete }: TabContentProps) {
  switch (isActive) {
    case "Accounts":
      return <AccountActions accounts={accounts} onComplete={onComplete} />;
    case "Transactions":
      return <Transaction account={accounts[0]} />;
    case "Beneficiaries":
      return <></>;
    default:
      return <AccountActions accounts={accounts} onComplete={onComplete} />;
  }
}

function AccountActions({ accounts, onComplete }: TabActionProps) {
  const { getSendMoney } = useSendMoney();
  const { getAddMoney } = useAddMoney();

  return (
    <section className="mt-3 rounded-md">
      <section>
        <h4 className="mb-[12px]">Accounts</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {getSendMoney(accounts, onComplete)}
          {getAddMoney(accounts, onComplete)}
        </div>
      </section>
    </section>
  );
}

export { Tab, TabContent };
