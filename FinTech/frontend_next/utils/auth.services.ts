import axios from "axios";

export const appConfig = {
  apiURL: "http://localhost:5000/api/v1/",
  tokenKey: "accessToken",
};

var axiosInstance = axios.create({
  baseURL: appConfig.apiURL,
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

axiosInstance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(appConfig.tokenKey);

const auth = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  patch: axiosInstance.patch,
  delete: axiosInstance.delete,
};

export default auth;
