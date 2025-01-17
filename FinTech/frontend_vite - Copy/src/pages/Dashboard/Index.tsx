import { useStore } from "@/components/hoc/StoreProvider";
import useUpdateUser from "@/components/hooks/useUpdateUser";
import MainLayout from "@/components/layout/mainLayout";
import { useEffect } from "react";
import Accounts from "./Account/Accounts";

const Home = () => {
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
      <div>
        <section className="flex">
          <section className="flex h-full w-full flex-col py-[35px] rounded-md bg-auth-bg">
            <section className="flex items-center justify-between max-[400px]:px-2 px-6  md:px-[52px]">
              <h1 className="hidden text-2xl md:block">
                <span className="text-[#67696B]">Hello,</span>{" "}
                <span className="text-[#101828] capitalize">
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

            <section className="mt-[20px] h-[556px] overflow-y-auto max-[400px]:px-2 px-6 md:px-[52px] border-t border-t-thin-slate no-scrollbar">
              <section className="">
                <Accounts />
              </section>
            </section>
          </section>
        </section>

        {getUpdateUser()}
      </div>
    </MainLayout>
  );
};

export default Home;
