"use client";

import { Search, Bell } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface TopBarProps {
  title?: string;
  onSearchClick?: () => void;
}

export function TopBar({ title = "My Day", onSearchClick }: TopBarProps) {
  const { profile } = useAuth();

  // Generate initials from user name
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "—";

  return (
    <header className="h-14 bg-surface border-b border-slate/10 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-midnight font-serif">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate bg-paper hover:bg-slate/10 rounded-md transition-colors min-h-[36px] sm:min-w-[160px]"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex ml-auto items-center gap-1 rounded border border-slate/20 bg-surface px-1.5 font-mono text-[10px] font-medium text-slate">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate hover:bg-paper rounded-full relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white ring-2 ring-surface">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-slate/15 mx-1"></div>

        <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-midnight text-white hover:ring-2 hover:ring-offset-2 hover:ring-midnight transition-all overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-teal">
          <span className="text-sm font-medium">{initials}</span>
        </button>
      </div>
    </header>
  );
}
