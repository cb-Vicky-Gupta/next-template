import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

/* ---------- Store Factory (SSR Safe) ---------- */
export const store = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
  });
};

/* ---------- Types ---------- */
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
