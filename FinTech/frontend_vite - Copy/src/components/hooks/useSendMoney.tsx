import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LabelInput, LabelSelect } from "../common/labelInput";
import React, { useEffect, useRef, useState } from "react";
import useAxios from "./useAxios";
import { accountUrl } from "@/utils/network";
import { AccountType, VerifyAccountType } from "@/utils/types";
import LoadingSpinner from "../common/loadingSpinner";
import { formatAccountFormat, getAccountSelect } from "@/utils/helpers";
import { useStore } from "../hoc/StoreProvider";
import { toast } from "sonner";
import SendMoneyConfirmation from "../common/sendMoneyConfirmation";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import ProcessCard from "../common/ProcessCard";

const useSendMoney = () => {
  const {
    state: { activeUser },
  } = useStore();
  const [data, setData] = useState<{
    account_no: string;
    amount: string;
  }>({
    account_no: "",
    amount: "",
  });
  const [account, setAccount] = useState<AccountType | null>(null);
  const [stage, setStage] = useState(0);
  const [modalState, setModalState] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [verifiedAccount, setVerifiedAccount] =
    useState<VerifyAccountType | null>(null);
  const { axiosHandler, loading } = useAxios();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const verifyAccountNumber = async () => {
    const res = await axiosHandler<VerifyAccountType>(
      accountUrl.verifyAccountNumber,
      "post",
      {
        account_no: data.account_no,
      },
      true
    );

    if (res) {
      console.log(res, account);
      if (res.user_id === activeUser?._id) {
        return toast.error("You can't send money to yourself");
      }

      if (res.currency !== account?.currency) {
        return toast.error("Currency mismatch");
      }

      setVerifiedAccount(res);
    }
  };

  const trackAccountNumberChanges = () => {
    if (data.account_no.length === 10) {
      inputRef.current?.blur();
      setVerifiedAccount(null);
      verifyAccountNumber();
    }
  };

  const closeModal = () => {
    setModalState(false);
    setData({
      account_no: "",
      amount: "",
    });
    setAccount(null);
    setVerifiedAccount(null);
  };

  useEffect(() => {
    trackAccountNumberChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.account_no]);

  const onAccountSelect = (accounts: AccountType[], key: string) => {
    const account = accounts.find(
      (account) =>
        formatAccountFormat(account.currency, account.balance) === key
    );
    if (account) setAccount(account);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStage(1);
  };

  const confirmPayment = async (onComplete: () => void) => {
    const payload = {
      from_account_id: account?._id,
      to_account_no: data.account_no,
      amount: parseFloat(data.amount),
    };

    const res = await axiosHandler(accountUrl.transfer, "post", payload, true);

    if (res) {
      toast.success("Money sent successfully");
      setStage(0);
      onComplete();
      closeModal();
    }
  };

  const getSendMoney = (accounts: AccountType[], onComplete: () => void) => {
    return (
      <Dialog open={modalState}>
        <DialogTrigger onClick={() => setModalState(true)}>
          <ProcessCard
            icon={<SendHorizontal className="text-auth-link" size={20} />}
            title={"Transfer"}
          />
        </DialogTrigger>
        <DialogContent customClose={closeModal}>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {stage === 1 && (
                <div className="mr-3" onClick={() => setStage(0)}>
                  <ChevronLeft />
                </div>
              )}
              {stage === 0 ? "Send Money" : "Confirm Payment"}
            </DialogTitle>
            <DialogDescription>Sending money made easy</DialogDescription>
          </DialogHeader>

          {stage === 0 && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <LabelSelect
                labelProps={{ children: "From Account" }}
                id="from_account_id"
                selectProps={{
                  placeholder: "Select Account",
                  name: "from_account_id",
                  required: true,
                  value: account
                    ? formatAccountFormat(account?.currency, account?.balance)
                    : "",
                  items: getAccountSelect(accounts, true),
                  onValueChange: (value) => onAccountSelect(accounts, value),
                }}
              />
              {account && (
                <LabelInput
                  labelProps={{ children: "Account Number" }}
                  inputProps={{
                    name: "account_no",
                    value: data.account_no,
                    onChange: handleChange,
                    ref: inputRef,
                  }}
                  id="account_number"
                />
              )}
              {loading && !verifiedAccount ? (
                <LoadingSpinner className="text-blue-500 mt-2" />
              ) : (
                verifiedAccount && (
                  <p className="mt-2 text-blue-500 text-sm">
                    Account Name: {verifiedAccount.email}
                  </p>
                )
              )}

              {verifiedAccount && (
                <LabelInput
                  labelProps={{ children: "Amount" }}
                  inputProps={{
                    name: "amount",
                    value: data.amount,
                    placeholder: "Enter amount",
                    onChange: handleChange,
                  }}
                  id="amount"
                />
              )}
              <Button
                className="mt-7 w-full"
                disabled={loading || !data.amount}
                loading={loading}
                variant={"secondary"}
              >
                Send
              </Button>
            </form>
          )}

          {stage === 1 && (
            <SendMoneyConfirmation
              toAccount={verifiedAccount as VerifyAccountType}
              fromAccount={account as AccountType}
              amount={data.amount}
              loading={loading}
              onComplete={() => confirmPayment(onComplete)}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return {
    getSendMoney,
  };
};

export default useSendMoney;
