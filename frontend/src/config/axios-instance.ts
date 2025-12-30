import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // cookie ishlashi uchun
});

const refreshAuthLogic = async () => {
  try {
    await instance.post("/auth/refresh", null, {
      withCredentials: true,
    });

    return await Promise.resolve();
  } catch (err: any) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.clear();
    window.location.href = "/";
    return Promise.reject(err);
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401],
});
