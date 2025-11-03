import { apiCall } from "../../axios";
import { authUrl } from "@/app/services/urls/auth";
export const login = async (payload: {
  email: string;
  password: string;
}): Promise<any> => {
  return apiCall({ url: authUrl.login, method: "POST", payload: payload });
};
export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<any> => {
  return apiCall({ url: authUrl.signup, method: "POST", payload: payload });
};
