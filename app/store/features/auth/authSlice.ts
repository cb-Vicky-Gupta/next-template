import { login } from "@/app/services/apiCalls/auth";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { actionNotifier } from "../../components/ui/toast";

// --- Types ---
interface AuthData {
  token: string;
  user: any; //
}

interface AuthState {
  authData: AuthData | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  authData: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

// --- Async Thunk for login ---
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

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.authData = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.clear();
    },
    restoreAuthFromLocal: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.authData = JSON.parse(token);
        state.isLoggedIn = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthData>) => {
          state.loading = false;
          state.authData = action.payload;
          state.isLoggedIn = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      });
  },
});

export const { logout, restoreAuthFromLocal } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
