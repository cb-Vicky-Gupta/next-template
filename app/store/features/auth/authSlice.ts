import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";
import type { RootState } from "../../store";

interface AuthData {
  token: string;
  user: any;
}
export interface AuthState {
  authData: AuthData | null;
}
const initialState: AuthState = {
  authData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.authData = null;
   },

    restoreAuth: (state, action: PayloadAction<AuthData>) => {
      state.authData = action.payload;
      
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthData>) => {
          state.authData = action.payload;
        }
      )
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
