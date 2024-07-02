import { AccountType } from "@/utils/types";
import { Card } from "../ui/card";
import { formatCurrency } from "@/utils/helpers";
import { EyeIcon } from "../auth/Icon";
import { useState } from "react";

type props = AccountType & {
  isDefault?: boolean;
  onClick?: () => void;
};

function AccountCard(props: props) {
  const [show, setShow] = useState(true);

  return (
    <Card
      className={`${
        props.isDefault ? "bg-auth-link text-white" : "bg-white text-slate-950"
      } rounded-md border-orange-200  p-5 relative cursor-pointer transition-all duration-500 hover:scale-105`}
      onClick={props.onClick}
    >
      <h2 className="text-2xl font-extralight">
        {props.currency}
        <br />
        <small className="text-base font-bold">{props.account_no}</small>
      </h2>
      <div className="mt-8" aria-label="hidden" />
      <div className="text-sm">Balance</div>
      <div className="flex items-center space-x-4">
        <h1 className="font-semibold text-xl">
          <span className="mr-1">{props.currency === "NGN" ? "₦" : "$"}</span>
          {show ? (
            "****"
          ) : (
            <span>{formatCurrency(props.balance.toString())}</span>
          )}
        </h1>
        <div className="cursor-pointer" onClick={() => setShow(!show)}>
          <EyeIcon changeIcon={show} />
        </div>
      </div>
    </Card>
  );
}

export default AccountCard;
