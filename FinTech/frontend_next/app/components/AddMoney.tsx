import { FormEvent, useEffect, useRef, useState } from "react";
import { AccountType } from "./Accounts";
import useAxiosHandler from "@/utils/axiosHandler";
import usePaystack, { Currency, MyPaystackProps } from "./hooks/usePaystack";
import { accountUrl } from "@/utils/network";
import { toast } from "react-toastify";

interface AddMoneyType {
  completeOperation: () => void;
  accounts: AccountType[];
}

const AddMoney = ({ completeOperation, accounts }: AddMoneyType) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MyPaystackProps>({
    amount: 0,
    currency: "NGN",
  });
  const form = useRef<HTMLFormElement>(null);
  const { axiosHandler } = useAxiosHandler();
  const { initTransaction } = usePaystack({
    amount: data.amount,
    currency: data.currency,
  });

  const onComplete = async (response: any) => {
    console.log(response);
    const arg = {
      reference: response.reference,
      status: response.status,
      to_account_id: form.current?.to_account_id.value.toString(),
      amount: data.amount,
    };

    const res = await axiosHandler({
      method: "POST",
      url: accountUrl.addMoney,
      isAuthorized: true,
      data: arg,
    });

    setLoading(false);

    if (res.data) {
      form.current?.reset();
      toast("Transaction successful", { type: "success" });
      completeOperation();
    }
  };

  useEffect(() => {
    if (data.amount > 0) {
      const tmp: any = (res: any) => {
        onComplete(res);
      };
      initTransaction(tmp, () => {
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const amount = parseFloat(form.current?.amount.value);
    const currency = accounts.find(
      (account) => account._id.toString() === form.current?.to_account_id.value
    )?.currency as unknown as Currency;
    setData({ amount, currency });
  };

  return (
    <div>
      <div className="modalHeading">
        <div className="title">Send Money</div>
      </div>
      <form ref={form} onSubmit={onSubmit}>
        <div className="modalBody userUpdate">
          <div className="formGroup">
            <label htmlFor="to_account_id">To Account</label>
            <select name="to_account_id" required>
              <option value="">Select Account</option>
              {accounts.map((account, index) => (
                <option key={index} value={account._id}>{`${
                  account.currency
                } - ${account.balance.toFixed(2)}`}</option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="amount">Amount</label>
            <input name="amount" type="number" required />
          </div>
        </div>
        <div className="modalFooter">
          <button type="submit" disabled={loading}>
            Submit{loading && "ting..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMoney;
