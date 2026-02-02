"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./store/storeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <StoreProvider>
          {children}
          <Toaster/>
        </StoreProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
