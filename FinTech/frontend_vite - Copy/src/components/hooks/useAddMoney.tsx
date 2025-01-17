import { LabelInput, LabelSelect } from "@/components/common/labelInput";
import ProcessCard from "@/components/common/ProcessCard";
import useAxios from "@/components/hooks/useAxios";
import usePaystack, { Currency } from "@/components/hooks/usePaystack";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAccountSelect } from "@/utils/helpers";
import { accountUrl } from "@/utils/network";
import { AccountType } from "@/utils/types";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowBigDownDash } from "lucide-react";

const useAddMoney = () => {
  const form = useRef<HTMLFormElement>(null);
  const { axiosHandler, loading } = useAxios();
  const { getInitTransaction } = usePaystack();
  const [showDialog, setShowDialog] = useState(false);

  const onComplete = async (
    response: any,
    amount: number,
    accountId: string,
    _onComplete: () => void
  ) => {
    const arg = {
      reference: response.reference,
      status: response.status,
      to_account_id: accountId,
      amount,
    };

    console.log(arg);

    const res = await axiosHandler(accountUrl.addMoney, "POST", arg, true);

    if (res) {
      form.current?.reset();
      toast.success("Transaction successful");
      _onComplete();
    }
  };

  const onSubmit = async (
    e: FormEvent<HTMLFormElement>,
    accounts: AccountType[],
    _onComplete: () => void
  ) => {
    e.preventDefault();

    const amount = parseFloat(form.current?.amount.value);
    const account_currency = form.current?.from_account_id.value;
    const account = accounts.find(
      (account) => account.currency === account_currency
    );

    if (!account) {
      toast.error("Invalid account selected");
      return;
    }

    const tmp: any = (res: any) => {
      onComplete(res, amount, account._id, _onComplete);
    };
    getInitTransaction(amount, account.currency as Currency, tmp);
    setShowDialog(false);
  };

  const getAddMoney = (accounts: AccountType[], onComplete: () => void) => {
    return (
      <Dialog open={showDialog}>
        <DialogTrigger onClick={() => setShowDialog(true)}>
          <ProcessCard
            icon={<ArrowBigDownDash className="text-auth-link" size={20} />}
            title={"Deposit"}
          />
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          customClose={() => setShowDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Deposit</DialogTitle>
          </DialogHeader>
          <form
            ref={form}
            onSubmit={(e) => onSubmit(e, accounts, onComplete)}
            className="space-y-5 mt-5"
          >
            <LabelSelect
              labelProps={{ children: "Source Account:" }}
              id="from_account_id"
              selectProps={{
                placeholder: "Select Account",
                name: "from_account_id",
                required: true,
                items: getAccountSelect(accounts),
              }}
            />
            <LabelInput
              labelProps={{ children: "Amount:" }}
              inputProps={{
                name: "amount",
                required: true,
                type: "number",
                placeholder: "Enter Amount",
              }}
              id={"amount"}
            />

            <DialogFooter className="flex items-center justify-center">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant={"secondary"}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    getAddMoney,
  };
};

export default useAddMoney;
