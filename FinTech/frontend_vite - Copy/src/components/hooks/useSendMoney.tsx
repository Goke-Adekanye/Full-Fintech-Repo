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
import { AccountType, BeneficiaryType, VerifyAccountType } from "@/utils/types";
import LoadingSpinner from "../common/loadingSpinner";
import {
  formatAccountFormat,
  formatBeneficiaryFormat,
  getAccountSelect,
  getBeneficiarySelect,
} from "@/utils/helpers";
import { useStore } from "../hoc/StoreProvider";
import { toast } from "sonner";
import SendMoneyConfirmation from "../common/sendMoneyConfirmation";
import { ChevronLeft, SendHorizontal, ReceiptText } from "lucide-react";
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
  const [beneficiary, setBeneficiary] = useState<BeneficiaryType | null>(null);
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
      // console.log(res, account);
      if (res.user_id === activeUser?._id) {
        return toast.error("You can't send money to yourself");
      }

      if (res.currency !== account?.currency) {
        return toast.error("Currency mismatch");
      }

      setVerifiedAccount(res);
    }
  };

  const handleSaveBeneficiary = async () => {
    const payload = {
      from_account_id: account?._id,
      to_email: verifiedAccount?.email,
      to_account_no: verifiedAccount?.account_no,
    };

    const res = await axiosHandler<VerifyAccountType>(
      accountUrl.addBeneficiary,
      "post",
      payload,
      true
    );

    if (res) {
      toast.success("Beneficiary saved");
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
    setStage(0);
    setAccount(null);
    setVerifiedAccount(null);
  };

  const onAccountSelect = (accounts: AccountType[], key: string) => {
    const account = accounts.find(
      (account) =>
        formatAccountFormat(account.currency, account.balance) === key
    );
    // console.log(account);
    if (account) setAccount(account);
  };

  const onBeneficiarySelect = (
    beneficiaries: BeneficiaryType[],
    key: string
  ) => {
    const beneficiary = beneficiaries.find(
      (beneficiary) =>
        formatBeneficiaryFormat(beneficiary.email, beneficiary.account_no) ===
        key
    );
    // console.log(account);
    if (beneficiary) setBeneficiary(beneficiary);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStage(1);
  };

  useEffect(() => {
    trackAccountNumberChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.account_no]);

  const confirmPayment = async (onComplete: () => void) => {
    const payload = {
      from_account_id: account?._id,
      to_account_no:
        beneficiary !== null ? Number(beneficiary.account_no) : data.account_no,
      amount: parseFloat(data.amount),
    };

    const res = await axiosHandler(accountUrl.transfer, "post", payload, true);

    if (res) {
      toast.success("Money sent successfully");
      setStage(0);
      setBeneficiary(null);
      onComplete();
      closeModal();
    }
  };

  const getSendMoney = (
    accounts: AccountType[],
    beneficiaries: BeneficiaryType[],
    onComplete: () => void
  ) => {
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
              {stage === 0 ? "Bank Transfers" : "Confirm Transfer"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {stage === 0 && (
            <section className="max-sm:max-h-[400px] overflow-y-auto no-scrollbar">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <LabelSelect
                  labelProps={{ children: "Source Account:" }}
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
                  <div className="space-y-4">
                    {beneficiaries.length > 0 && (
                      <LabelSelect
                        labelProps={{ children: "Select Beneficiary:" }}
                        id="beneficiaries"
                        selectProps={{
                          placeholder: "Select",
                          name: "beneficiaries",
                          value: beneficiary
                            ? formatBeneficiaryFormat(
                                beneficiary.email,
                                beneficiary.account_no
                              )
                            : "",
                          items: getBeneficiarySelect(beneficiaries),

                          // items: getAccountSelect(accounts, true),
                          onValueChange: (value) =>
                            onBeneficiarySelect(beneficiaries, value),
                        }}
                      />
                    )}
                    {!beneficiary && (
                      <div>
                        <LabelInput
                          labelProps={{ children: "Beneficiary Account:" }}
                          inputProps={{
                            name: "account_no",
                            value: data.account_no,
                            onChange: handleChange,
                            ref: inputRef,
                          }}
                          id="account_number"
                        />
                        {loading && !verifiedAccount ? (
                          <LoadingSpinner className=" text-auth-link mt-1" />
                        ) : (
                          verifiedAccount && (
                            <p className="w-full flex justify-end text-auth-link text-xs mt-1">
                              Account Name: {verifiedAccount.email}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  {verifiedAccount || beneficiary ? (
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
                  ) : null}
                  {verifiedAccount && !beneficiary ? (
                    <div className="w-full mt-1 flex justify-end items-center ">
                      <div
                        className="cursor-pointer flex justify-end items-center"
                        onClick={handleSaveBeneficiary}
                      >
                        <ReceiptText className="text-[#12B76A] h-4 w-4" />
                        <span className="block text-xs ml-1 opacity-90">
                          Save as beneficiary
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <Button
                  className="mt-7 w-full"
                  disabled={loading || !data.amount}
                  // loading={loading}
                  variant={"secondary"}
                >
                  Send
                </Button>
              </form>
            </section>
          )}

          {stage === 1 && (
            <SendMoneyConfirmation
              toAccount={
                (verifiedAccount as VerifyAccountType) ||
                (beneficiary as BeneficiaryType)
              }
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
