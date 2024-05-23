import { userTokenKey } from "@/utils/contants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

const withoutAuth = <T extends Object>(
  WrapperComponent: React.ComponentType<T>
) => {
  const WithoutAuth = (props: T) => {
    const [checking, setChecking] = useState(false);
    const Router = useRouter();

    useEffect(() => {
      setChecking(true);
      const userToken = localStorage.getItem(userTokenKey);
      if (userToken) {
        Router.push("/");
      } else {
        setChecking(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (checking) return <Loader />;

    return <WrapperComponent {...props} />;
  };

  return WithoutAuth;
};

export default withoutAuth;
