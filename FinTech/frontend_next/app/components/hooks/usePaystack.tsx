import { useContext } from "react";
import { store } from "../StoreProvider";
import { usePaystackPayment } from "react-paystack";

const TestPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
export type Currency = "USD" | "NGN";

export interface MyPaystackProps {
  amount: number;
  currency: Currency;
}

const usePaystack = ({ amount, currency }: MyPaystackProps) => {
  const {
    state: { activeUser },
  } = useContext(store);

  const initTransaction = usePaystackPayment({
    email: activeUser?.email as string,
    amount: amount * 100,
    currency,
    publicKey: TestPublicKey as string,
    label: "Fintech App",
  });

  return {
    initTransaction,
  };
};

export default usePaystack;
