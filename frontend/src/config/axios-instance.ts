import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // cookie ishlashi uchun
});

instance.interceptors.request.use(async (config) => {
  if (config.url !== "/auth/refresh") {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

const refreshAuthLogic = async (failedRequest: any) => {
  try {
    const res = await instance.post("/auth/refresh", null, {
      withCredentials: true,
    });

    const token = res.data.accessToken;
    Cookies.set("accessToken", token);

    failedRequest.response.config.headers["Authorization"] = `Bearer ${token}`;

    return await Promise.resolve();
  } catch (err: any) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/";
    return Promise.reject(err);
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401],
});
