"use client";

import { FC, FormEvent, useRef } from "react";
import { AccessLogo, InputIcon } from "./Icon";
import Input from "./Input";
import { Link } from "react-router-dom";

interface AuthType {
  buttonTitle?: string;
  showRemembered?: boolean;
  loading: boolean;
  accountInfoText?: {
    initialText?: string;
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
    initialText: "Open savings account",
    actionText: "Register on internet banking",
    actionLink: "/signup",
  },
  loading,
  onSubmit,
}) => {
  const form = useRef<HTMLFormElement>(null);
  return (
    <>
      <section className="grid grid-cols-3">
        <div className="p-6 bg-auth-section flex col-span-2 flex-col">
          <div className="flex items-center justify-between">
            <div className="inline-block cursor-pointer">
              <AccessLogo />
            </div>
          </div>
          <div className="max-w-[425px] m-auto w-full">
            <h1 className="mb-2 text-[28px]">
              Welcome to Access Internet Banking
            </h1>
            <p className="text-xs mb-4">
              Sign in with your Internet Banking details or Access More login
              details. Not registered on Internet Banking or Access More? Click
              on register to get started
            </p>
            <p className="text-xs mb-4">
              {accountInfoText.initialText && (
                <>
                  <span>No account?</span>
                  <Link
                    className="text-auth-link text-xs font-bold"
                    to="/sign-up"
                  >
                    {" "}
                    {accountInfoText.initialText}
                  </Link>
                </>
              )}
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
                <section className="font-semibold rounded-lg shadow-button-shadow">
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-base w-full py-4 px-0 rounded-lg justify-center items-center flex cursor-pointer border-none text-auth-button bg-auth-link"
                  >
                    {buttonTitle} {loading && "..."}
                  </button>
                </section>
                <section className="font-semibold rounded-lg shadow-button-shadow mt-4">
                  <Link
                    to={accountInfoText.actionLink}
                    className="text-base w-full py-4 px-0 rounded-lg justify-center items-center flex cursor-pointer border-none text-auth-button-two border-thin-slate"
                  >
                    {accountInfoText.actionText}
                  </Link>
                </section>
              </div>
            </form>
          </div>
        </div>

        <div className="block relative">
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
