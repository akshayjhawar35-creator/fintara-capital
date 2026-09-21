"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5 shrink-0" /> : null;
  };

  return (
    <aside className="hidden md:flex flex-col bg-[#101A3D] text-white w-[64px] lg:w-[240px] shrink-0 border-r border-[#1B7F8E]/20 transition-all duration-300">
      <div className="h-14 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/10 shrink-0">
        <div className="h-8 w-8 bg-white/20 rounded-md flex items-center justify-center text-sm font-bold">FC</div>
        <span className="ml-3 font-semibold text-lg hidden lg:block truncate">Fintara Desk</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2 lg:px-3">
        {NAV_ITEMS.map((item) => {
          // Normalize paths for exact matching or sub-path matching
          const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center min-h-[44px] px-2 lg:px-3 rounded-md group transition-colors relative",
                isActive 
                  ? "bg-white text-[#101A3D]" 
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E2A62B] rounded-l-md" />
              )}
              <div className="flex items-center justify-center w-6 h-6">
                {renderIcon(item.icon)}
              </div>
              <span className="ml-3 hidden lg:block text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="mt-6 mb-2 px-2 lg:px-3 hidden lg:block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Admin
            </div>
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center min-h-[44px] px-2 lg:px-3 rounded-md group transition-colors relative",
                    isActive 
                      ? "bg-white text-[#101A3D]" 
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                  title={item.label}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E2A62B] rounded-l-md" />
                  )}
                  <div className="flex items-center justify-center w-6 h-6">
                    {renderIcon(item.icon)}
                  </div>
                  <span className="ml-3 hidden lg:block text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
}
