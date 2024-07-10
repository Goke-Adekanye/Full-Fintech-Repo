import { useEffect, useState } from "react";
import { AccountType, BeneficiaryType } from "@/utils/types";
import useAxios from "@/components/hooks/useAxios";
import { accountUrl } from "@/utils/network";
import LoadingSpinner from "@/components/common/loadingSpinner";
import { toast } from "sonner";

type props = {
  account: AccountType;
};

const Beneficiaries = ({ account }: props) => {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { axiosHandler } = useAxios();

  const getBeneficiaries = async () => {
    const res = await axiosHandler<BeneficiaryType[]>(
      accountUrl.beneficiaries,
      "POST",
      { account_id: account._id },
      true
    );
    setLoading(false);
    if (res) {
      setBeneficiaries(res);
    }
  };

  const deleteBeneficiaries = async (id: string) => {
    const res = await axiosHandler<BeneficiaryType[]>(
      accountUrl.deleteBeneficiary,
      "DELETE",
      { beneficiary_id: id, account_id: account._id },
      true
    );
    if (res) {
      setBeneficiaries((prevBeneficiaries) =>
        prevBeneficiaries.filter((beneficiary) => beneficiary._id !== id)
      );
    }
    setLoading(false);
    toast.success("Beneficiary deleted successfully");
  };

  useEffect(() => {
    setLoading(true);
    getBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="mt-3">
      <h4 className="mb-[12px]">Beneficiaries</h4>
      {loading ? (
        <LoadingSpinner className="text-orange-500" />
      ) : beneficiaries.length === 0 ? (
        <section className="flex h-10 items-start justify-center">
          <img src="Empty-Beneficiary.png" alt="" className="mt-10" />
        </section>
      ) : (
        <section className="rounded-md p-2 max-w-lg">
          {beneficiaries.map((item) => (
            <div
              className="rounded bg-auth-bg mb-6 p-2 box-shadow-3 border-l-[6px] border-orange-200"
              key={item._id}
            >
              <div className="flex items-center justify-between align-middle">
                <div className="col-span-2 flex items-center space-x-2">
                  <div className="max-[257px]:text-[8px] max-[350px]:text-[10px] text-[13px]">
                    <span className="block leading-loose">
                      {item.account_no}
                    </span>
                    <span className="block">{item.email}</span>
                  </div>
                </div>
                <button
                  className={`max-[350px]:text-[10px] text-xs font-bold py-[1px] px-2 rounded-xl  border border-l-thin-slate bg-auth-link hover:bg-trans-debit transition-all duration-500 text-white`}
                  type="button"
                  onClick={() => deleteBeneficiaries(item._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Beneficiaries;
