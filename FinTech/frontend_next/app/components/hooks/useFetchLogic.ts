import auth from "@/utils/auth.services";
import { errorHandler } from "@/utils/errorHandler";
import { useState } from "react";

const useFetchLogic = (apiUrl: string) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const onRequest = async (payload = "", method = auth.post) => {
    setLoading(true);

    method(apiUrl, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        errorHandler(err.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createRequestHandler = (method: any) => (payload: any) =>
    onRequest(payload, method);

  const post = createRequestHandler(auth.post);
  const patch = createRequestHandler(auth.patch);
  const get = createRequestHandler(auth.get);
  const remove = createRequestHandler(auth.delete);

  return { post, get, patch, remove, response, loading };
};

export default useFetchLogic;
