import { LabelSelect } from "@/components/common/labelInput";
import useAxios from "@/components/hooks/useAxios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { accountUrl } from "@/utils/network";
import { UserType } from "@/utils/types";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

const useAddAccount = () => {
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const { axiosHandler } = useAxios();

  const onSubmit = async (
    e: FormEvent<HTMLFormElement>,
    onComplete: () => void
  ) => {
    e.preventDefault();
    setLoading(true);
    const arg = {
      currency: form.current?.currency.value,
    };

    const res = await axiosHandler<UserType>(accountUrl.add, "POST", arg, true);

    setLoading(false);

    if (res) {
      toast.success("Account created successfully");
      onComplete();
      setDialogState(false);
    }
  };

  const getAddAccount = (onComplete: () => void) => {
    return (
      <Dialog open={dialogState}>
        <DialogTrigger onClick={() => setDialogState(true)}>
          <Button variant={"outline"}>Create Account</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          closeIcon={true}
          customClose={() => setDialogState(false)}
        >
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <form
            ref={form}
            onSubmit={(e) => onSubmit(e, onComplete)}
            className="pt-5"
          >
            <LabelSelect
              labelProps={{ children: "Currency" }}
              id="currency"
              className="mb-10"
              selectProps={{
                placeholder: "Choose currency",
                name: "currency",
                required: true,
                items: [
                  { key: "NGN", value: "NGN" },
                  { key: "USD", value: "USD" },
                ],
              }}
            />
            <DialogFooter>
              <Button
                disabled={loading}
                loading={loading}
                variant={"secondary"}
                type="submit"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    getAddAccount,
  };
};

export default useAddAccount;
