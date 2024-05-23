"use client";

import { FC, FormEvent, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import src from "../assets/iphone.png";
import srcLine from "../assets/lines.png";
import { AccessLogo, InputIcon } from "./Icon";
import Input from "./Input";
import Loader from "./Loader";

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
    actionLink: "/sign-up",
  },
  loading,
  onSubmit,
}) => {
  const form = useRef<HTMLFormElement>(null);
  return (
    <>
      <section className="auth">
        <div className="auth-section__first flex col-span__2 flex-col h-screen">
          <div className="flex items-center justify-between">
            <div className="inline-block cursor-pointer">
              <AccessLogo />
            </div>
          </div>
          <div className="form-area m-auto w-full">
            <h1>Welcome to Access Internet Banking</h1>
            <p className="text-xs">
              Sign in with your Internet Banking details or Access More login
              details. Not registered on Internet Banking or Access More? Click
              on register to get started
            </p>
            <p className="text-xs">
              {accountInfoText.initialText && (
                <>
                  <span>No account?</span>
                  <Link className="auth-link text-xs font-bold" href="/sign-up">
                    {" "}
                    {accountInfoText.initialText}
                  </Link>
                </>
              )}
            </p>
            <form ref={form} onSubmit={(e) => onSubmit(e, form)}>
              <div>
                <div className="input-area flex items-center">
                  <section className="mr-3">
                    <InputIcon changeIcon />
                  </section>
                  <Input label="Email" name="email" type="email" required />
                </div>

                <div className="input-area second flex items-center">
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

                <Link className="text-xs auth-link" href="/">
                  <span className="auth-link__span flex justify-end">
                    Forgot Username or Password?
                  </span>
                </Link>
              </div>

              <div className="auth-buttons">
                <section className="auth-button__section">
                  <button
                    type="submit"
                    disabled={loading}
                    className="top-button"
                  >
                    {buttonTitle} {loading && "..."}
                  </button>
                </section>
                <section className="auth-button__section second">
                  <Link
                    href={accountInfoText.actionLink}
                    className="top-button"
                  >
                    {accountInfoText.actionText}
                  </Link>
                </section>
              </div>
            </form>
          </div>
        </div>

        <div className="auth-section__second h-screen">
          <div className="flex w-full items-center justify-center py-10">
            <Image width={333} height={580} src={src} alt="banner" />
          </div>
          <Image src={srcLine} alt="line" className="line-image w-full" />
        </div>
      </section>

      {loading && <Loader />}
    </>
  );
};

export default Auth;
