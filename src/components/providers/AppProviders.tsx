"use client";

import React from "react";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { DataProvider } from "@/lib/data/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
}
