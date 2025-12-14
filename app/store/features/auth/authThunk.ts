import { login } from "@/app/services/apiCalls/auth";
import {  createAsyncThunk} from "@reduxjs/toolkit";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials }: { credentials: any }, { rejectWithValue }) => {
    try {
      const result = await login(credentials);
      if (result.status) {
        localStorage.setItem("token", JSON.stringify(result.data));
        return result.data;
      } else {
        // actionNotifier.error(result.message);
        return rejectWithValue(result.message);
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
