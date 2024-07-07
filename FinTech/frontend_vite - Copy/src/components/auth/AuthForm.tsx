"use client";

import { FC, FormEvent, useRef } from "react";
import { InputIcon } from "./Icon";
import Input from "./Input";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface AuthType {
  buttonTitle?: string;
  showRemembered?: boolean;
  loading: boolean;
  accountInfoText?: {
    initialText: string;
    actionText: string;
    actionLink: string;
  };
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    formRef: React.RefObject<HTMLFormElement>
  ) => void;
}

const Auth: FC<AuthType> = ({
  buttonTitle = "Log In",
  accountInfoText = {
    initialText: "No account?",
    actionText: "Register on ape banking",
    actionLink: "/signup",
  },
  loading,
  onSubmit,
}) => {
  const form = useRef<HTMLFormElement>(null);
  return (
    <>
      <section className="grid md:grid-cols-3">
        <div className="p-6 bg-auth-section flex h-screen flex-col md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="inline-block cursor-pointer">
              <img src="icon.png" alt="" className="h-50" />
            </div>
          </div>
          <div className="max-w-[425px] m-auto w-full">
            <h1 className="mb-2 text-[28px]">Welcome to Ape Banking</h1>
            <p className="text-xs mb-4">
              Sign in with your Ape Banking details. Not registered on Ape
              Internet Banking? Click on register to get started
            </p>
            <p className="text-xs mb-4">
              <>
                <span>{accountInfoText.initialText}</span>
                <Link
                  className="text-auth-link text-xs font-bold"
                  to={accountInfoText.actionLink}
                >
                  {" "}
                  {accountInfoText.actionText}
                </Link>
              </>
            </p>
            <form ref={form} onSubmit={(e) => onSubmit(e, form)}>
              <div>
                <div className="px-3 py-1 rounded-md bg-auth-bg flex items-center">
                  <section className="mr-3">
                    <InputIcon changeIcon />
                  </section>
                  <Input label="Email" name="email" type="email" required />
                </div>

                <div className="mt-4 px-3 py-1 rounded-md bg-auth-bg flex items-center">
                  <section className="mr-3">
                    <InputIcon />
                  </section>
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                  />
                </div>

                <Link className="text-xs text-auth-link font-bold" to="/">
                  <span className="mt-2 flex justify-end">
                    Forgot Username or Password?
                  </span>
                </Link>
              </div>

              <div className="mt-3">
                <Button
                  disabled={loading}
                  loading={loading}
                  variant={"secondary"}
                  type="submit"
                  className="w-full"
                  size={"auth"}
                >
                  {buttonTitle}
                </Button>
                <Link
                  to={accountInfoText.actionLink}
                  className="font-medium shadow-button-shadow mt-4 text-sm w-full py-4 px-0 rounded-lg justify-center items-center flex cursor-pointer border-none text-auth-button-two border-thin-slate"
                >
                  {accountInfoText.actionText}
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="relative hidden h-screen md:block">
          <div className="flex w-full items-center justify-center py-6">
            <img width={333} height={580} src="/iphone.png" alt="banner" />
          </div>
          <img
            src="/lines.png"
            alt="line"
            className="block h-auto max-w-full absolute left-0 right-0 bottom-0 w-full"
          />
        </div>
      </section>
    </>
  );
};

export default Auth;
