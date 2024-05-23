import axios, { AxiosError, AxiosResponse } from "axios";
import { userTokenKey } from "./contants";
import { errorHandler } from "./errorHandler";
import useLogout from "@/app/components/hooks/useLogout";

// Define the interface for the AxiosHandlerType
interface AxiosHandlerType<T> {
  method: "GET" | "POST" | "PATCH";
  url: string;
  data?: { [key: string]: number | string };
  handleError?: boolean;
  isAuthorized?: boolean;
}

// Define the ResponseType interface
interface ResponseType<T> {
  data?: T;
  error?: AxiosError | null;
}

// Define the useAxiosHandler hook
const useAxiosHandler = () => {
  const { logout } = useLogout();

  // Define the axiosHandler function
  const axiosHandler = async <T>(
    props: AxiosHandlerType<T>
  ): Promise<ResponseType<T>> => {
    const {
      method,
      url,
      data,
      isAuthorized = false,
      handleError = true,
    } = props;

    const config = {
      url,
      method,
      data,
      headers: {},
    };

    if (isAuthorized) {
      const userToken = localStorage.getItem(userTokenKey);
      config.headers = {
        Authorization: `Bearer ${userToken}`,
      };
    }

    let error = null;

    const response = (await axios(config).catch((e: AxiosError) => {
      if (e.response?.status === 401) {
        logout();
      }
      if (handleError) {
        errorHandler(e);
      } else {
        error = e;
      }
    })) as AxiosResponse<T>;

    return {
      data: response?.data,
      error,
    };
  };

  return {
    axiosHandler,
  };
};

export default useAxiosHandler;
