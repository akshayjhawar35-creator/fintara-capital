"use client";

import { Search, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  onSearchClick?: () => void;
}

export function TopBar({ title = "My Day", onSearchClick }: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-[#101A3D] font-newsreader">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors min-h-[36px] sm:min-w-[160px]"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex ml-auto items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E2A62B] text-[10px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#101A3D] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#101A3D] transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1B7F8E]">
          <span className="text-sm font-medium">AK</span>
        </button>
      </div>
    </header>
  );
}
