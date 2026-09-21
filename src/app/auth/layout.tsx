"use client";

import { AuthProvider } from "@/lib/hooks/use-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
