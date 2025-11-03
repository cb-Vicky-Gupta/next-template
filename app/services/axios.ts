import axios, { AxiosRequestConfig, Method } from "axios";
import { RootState, store } from "../store/store";

export interface ApiResponse<T = any> {
  data: T | {};
  status: boolean;
  message: string;
}

export interface ApiOptions {
  url: string;
  method: Method;
  payload?: any;
  headers?: Record<string, any>;
  responseType?: "json" | "blob" | "formData";
}

/**
 * Auto fetch token from Redux store or sessionStorage
 */
const getToken = (): string | null => {
  if (!store) return null;

  const state: RootState = store().getState();
  // Example: auth slice has user/token
  const token =
    state.auth?.authData?.token || // auth slice token
    sessionStorage.getItem("auth-token") || // fallback sessionStorage
    null;

  return token;
};

export const apiCall = async <T = any>({
  url,
  method,
  payload,
  headers = {},
  responseType = "json",
}: ApiOptions): Promise<ApiResponse<T> | Blob> => {
  try {
    // Default headers
    const defaultHeaders: Record<string, string> = {
      "X-Institution-Id": process.env.NEXT_PUBLIC_INSTITUTION_ID || "",
    };

    // Attach token automatically if available
    const token = getToken();
    if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;

    // Merge headers
    const finalHeaders = { ...defaultHeaders, ...headers };

    // Axios config
    const config: AxiosRequestConfig = {
      url,
      method,
      data: payload ?? {},
      headers: finalHeaders,
      responseType: responseType === "blob" ? "blob" : "json",
    };

    if (responseType === "formData") {
      finalHeaders["Content-Type"] = "multipart/form-data";
    }

    const response = await axios(config);

    if (responseType === "blob") return response.data;

    return {
      data: response.data.data ?? {},
      status: response.data.status === "success",
      message: response.data.message || "",
    };
  } catch (error: any) {
    return {
      data: error.response?.data ?? {},
      status: false,
      message: error.response?.data?.message || "Unexpected error occurred",
    };
  }
};
