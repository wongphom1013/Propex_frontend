"use client";

import { Provider as JotaiProvider } from "jotai";
import { NextUIProvider } from "@nextui-org/react";
import GlobalComponentProvider from "./_providers/GlobalComponentProvider";
import { SessionProvider } from "next-auth/react";
import { RefreshProvider } from "./_providers/RefreshProvider";
import ThirdWebProvider from "./_providers/ThirdWebProvider";
import { AuthProvider } from "../_providers/AuthProvider";

export default function AppProvider({ children }) {
  return (
    <SessionProvider>
      <JotaiProvider>
        <RefreshProvider>
          <ThirdWebProvider>
            <AuthProvider>
              <NextUIProvider>
                <GlobalComponentProvider>{children}</GlobalComponentProvider>
              </NextUIProvider>
            </AuthProvider>
          </ThirdWebProvider>
        </RefreshProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
