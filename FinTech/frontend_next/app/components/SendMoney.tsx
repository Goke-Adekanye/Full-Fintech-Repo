import { FormEvent, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { accountUrl } from "@/utils/network";
import { store } from "./StoreProvider";
import { AccountType } from "./Accounts";
import useAxiosHandler from "@/utils/axiosHandler";

interface SendMoneyType {
  completeOperation: () => void;
  accounts: AccountType[];
}

const SendMoney = ({ completeOperation, accounts }: SendMoneyType) => {
  const [loading, setLoading] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const { dispatch } = useContext(store);
  const { axiosHandler } = useAxiosHandler();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let arg = {
      from_account_id: form.current?.from_account_id.value.toString(),
      to_account_id: form.current?.to_account_id.value.toString(),
      amount: parseInt(form.current?.amount.value),
    };

    const res = await axiosHandler({
      method: "POST",
      url: accountUrl.transfer,
      isAuthorized: true,
      data: arg,
    });

    setLoading(false);

    if (res.data) {
      toast("Transfer successful", { type: "success" });
      completeOperation();
    }
  };

  return (
    <div>
      <div className="modalHeading">
        <div className="title">Send Money</div>
      </div>
      <form ref={form} onSubmit={onSubmit}>
        <div className="modalBody userUpdate">
          <div className="formGroup">
            <label htmlFor="from_account_id">From Account</label>
            <select name="from_account_id" required>
              <option value="">Select Account</option>
              {accounts.map((account, index) => (
                <option key={index} value={account._id}>{`${
                  account.currency
                } - ${account.balance.toFixed(2)}`}</option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="to_account_id">To Account</label>
            <input
              type="text"
              name="to_account_id"
              placeholder="Specify the account to send to"
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="amount">Amount</label>
            <input name="amount" type="number" required />
          </div>
        </div>
        <div className="modalFooter">
          <button type="submit" disabled={loading}>
            Submit{loading && "..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMoney;
