"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/app/shell/Sidebar";
import { TopBar } from "@/components/app/shell/TopBar";
import { BottomNav } from "@/components/app/shell/BottomNav";
import { CommandPalette } from "@/components/app/shell/CommandPalette";
import { AuthProvider, useAuth } from "@/lib/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!isLoading && user && pathname.startsWith("/app/admin") && !isAdmin) {
      router.replace("/app/");
    }
  }, [isLoading, user, isAdmin, pathname, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-paper">
        <Loader2 className="h-8 w-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <AuthGate>
      <div className="flex h-screen w-full bg-paper overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar onSearchClick={() => setCmdOpen(true)} />

          <main className="flex-1 overflow-y-auto pb-20 md:pb-0 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        <BottomNav />
        <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
      </div>
    </AuthGate>
  );
}

import { DataProvider } from "@/lib/data/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <AppShell>{children}</AppShell>
      </DataProvider>
    </AuthProvider>
  );
}
