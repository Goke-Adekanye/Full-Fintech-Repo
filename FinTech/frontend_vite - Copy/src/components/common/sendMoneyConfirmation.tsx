import { formatCurrency } from "@/utils/helpers";
import { AccountType, BeneficiaryType, VerifyAccountType } from "@/utils/types";
import { Button } from "../ui/button";
import { useStore } from "../hoc/StoreProvider";

type props = {
  toAccount: VerifyAccountType | BeneficiaryType;
  fromAccount: AccountType;
  amount: string;
  loading?: boolean;
  onComplete: () => void;
};

const SendMoneyConfirmation = ({
  toAccount,
  fromAccount,
  amount,
  loading,
  onComplete,
}: props) => {
  const {
    state: { activeUser },
  } = useStore();
  return (
    <div className="space-y-3 max-sm:max-h-[430px] overflow-y-auto no-scrollbar">
      <section>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 md:items-center">
          <div className="space-y-[4px] sm:w-[30%]">
            <span className="block text-[12px] text-[#667085]">Source:</span>
            <span className="block text-[14px]">{activeUser?.email}</span>
            <span className="block text-[12px] text-[#667085]">
              {fromAccount.account_no}
            </span>
          </div>
          <div className="sm:w-[30%]">
            <span className="block text-center text-[24px] font-semibold">
              <span className="mr-[2px]">
                {fromAccount.currency === "NGN" ? "₦" : "$"}
              </span>
              {formatCurrency(amount)}
            </span>
            <div className="flex items-center justify-between">
              <span className="block h-[9px] w-[9px] rounded-full bg-[#12B76A]"></span>
              <span className="block h-[1px] w-full bg-[#E4E4E4]"></span>
              <span className="block h-[9px] w-[9px] rounded-full bg-[#12B76A]"></span>
            </div>
          </div>
          <div className="space-y-[4px] sm:w-[30%]">
            <span className="block text-[12px] text-[#667085]">Recipient:</span>
            <span className="block text-[14px]">{toAccount.email}</span>
            <span className="block text-[12px] text-[#667085]">
              {toAccount.account_no}
            </span>
          </div>
        </div>

        <div className="mt-[32px] mb-[20px] rounded-md bg-[#F7F7F7] px-[24px]">
          <div className="flex border-b border-b-thin-slate py-4 flex-row items-center justify-between">
            <span className="text-sm text-slate-700">Currency:</span>
            <span className="text-sm text-auth-link">
              {fromAccount.currency}
            </span>
          </div>
          <div className="flex border-b border-b-thin-slate py-4 flex-row items-center justify-between">
            <span className="text-sm text-slate-700">Commission:</span>
            <span className="text-sm text-auth-link">NIL</span>
          </div>
          <div className="flex py-4 flex-row items-center justify-between">
            <span className="text-sm text-slate-700">Total debit:</span>
            <span className="text-sm font-semibold text-auth-link space">
              <span className="mr-[2px]">
                {fromAccount.currency === "NGN" ? "₦" : "$"}
              </span>
              {formatCurrency(amount)}
            </span>
          </div>
        </div>
      </section>

      <Button
        onClick={onComplete}
        className="w-full"
        variant={"secondary"}
        disabled={loading}
        loading={loading}
      >
        {loading ? "Sending... Please wait!" : "Confirm"}
      </Button>
    </div>
  );
};

export default SendMoneyConfirmation;
