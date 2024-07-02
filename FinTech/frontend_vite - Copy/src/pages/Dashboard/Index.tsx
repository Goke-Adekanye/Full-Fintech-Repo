import { useStore } from "@/components/hoc/StoreProvider";
import useUpdateUser from "@/components/hooks/useUpdateUser";
import MainLayout from "@/components/layout/mainLayout";
import { useEffect, useState } from "react";
import Accounts from "../Account/Accounts";
import { AccountType } from "@/utils/types";
import ProcessCard from "@/components/common/ProcessCard";
import { SendHorizontal, ArrowBigDownDash, ReceiptText } from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [defaultAccount, setDefaultAccount] = useState<AccountType | null>(
    null
  );
  const { getUpdateUser, setDialogState } = useUpdateUser();
  const {
    state: { activeUser },
  } = useStore();
  useEffect(() => {
    if (!activeUser?.username) {
      setDialogState(true);
    }
  }, [activeUser?.username, setDialogState]);
  return (
    <MainLayout>
      <main>
        <section className="flex">
          <div></div>
          <section className="flex h-full w-full flex-1 flex-col pb-[10px] pt-[25px] rounded-md bg-auth-bg">
            <section className="flex items-center justify-between px-6  md:px-[52px]">
              <h1 className="hidden text-2xl md:block">
                <span className="text-[#67696B]">Hello,</span>{" "}
                <span className="text-[#101828]">
                  {activeUser?.username || "user"}
                </span>{" "}
                👋🏾
              </h1>

              <section className="flex items-center gap-x-2">
                <div className="relative min-w-[243px]">
                  <button className="flex gap-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full">
                      <img src="avatar.svg" alt="avi" />
                    </div>
                    <div className="my-auto flex flex-col gap-y-1 text-left">
                      <h6 className="text-sm font-medium capitalize">
                        {activeUser?.username || ""}
                      </h6>
                      <p className="text-xs text-slate-600">
                        {activeUser?.email || ""}
                      </p>
                    </div>
                  </button>
                </div>
              </section>
            </section>

            <section className="mt-[40px] px-6 md:px-[52px]">
              <section className="mb-[68px]">
                <Accounts updateDefaultAccount={setDefaultAccount} />
                {defaultAccount && ""}
              </section>

              {/* TAB */}
              <section className="-mb-px flex w-2/3 space-x-8 rounded-md bg-auth-section p-2">
                <section
                  className={`${
                    activeTab === "accounts"
                      ? "text-auth-link bg-auth-lighter"
                      : ""
                  } flex w-1/3 cursor-pointer transition-all duration-500  items-center justify-center space-x-2 whitespace-nowrap rounded-md p-3 text-center text-xs font-semibold`}
                  onClick={() => setActiveTab("accounts")}
                >
                  Account
                </section>
                <section
                  className={`${
                    activeTab === "transactions"
                      ? "text-auth-link bg-auth-lighter"
                      : ""
                  } flex w-1/3 cursor-pointer transition-all duration-500 items-center justify-center space-x-2 whitespace-nowrap rounded-md p-3 text-center text-xs font-semibold`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transaction History
                </section>
                <section
                  className={`${
                    activeTab === "beneficials"
                      ? "text-auth-link bg-auth-lighter"
                      : ""
                  } flex w-1/3 cursor-pointer transition-all duration-500 items-center justify-center space-x-2 whitespace-nowrap rounded-md p-3 text-center text-xs font-semibold`}
                  onClick={() => setActiveTab("beneficials")}
                >
                  Beneficiaries
                </section>
              </section>

              {/* TAB CONTENT */}
              <section className="mt-3 rounded-md">
                <section>
                  <h4 className="mb-[12px]">Accounts</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <ProcessCard
                      icon={
                        <SendHorizontal className="text-auth-link" size={20} />
                      }
                      title={"Transfer"}
                    />
                    <ProcessCard
                      icon={
                        <ArrowBigDownDash
                          className="text-auth-link"
                          size={20}
                        />
                      }
                      title={"Deposit"}
                    />
                    <ProcessCard
                      icon={
                        <ReceiptText className="text-auth-link" size={20} />
                      }
                      title={"Bill Payments"}
                    />
                  </div>
                </section>
              </section>
            </section>
          </section>
        </section>

        {getUpdateUser()}
      </main>
    </MainLayout>
  );
};

export default Home;
