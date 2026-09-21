"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ClipboardList, LayoutDashboard, Briefcase, MoreHorizontal, PenSquare } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "My Day", href: "/app/", icon: Home },
    { label: "Leads", href: "/app/leads/", icon: ClipboardList },
    { label: "Pipeline", href: "/app/pipeline/", icon: LayoutDashboard },
    { label: "Portfolio", href: "/app/portfolio/", icon: Briefcase },
    { label: "More", href: "/app/more/", icon: MoreHorizontal },
  ];

  return (
    <>
      {/* Floating Action Button — Log contact */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <button className="flex items-center justify-center w-14 h-14 bg-teal text-white rounded-full shadow-lg hover:bg-teal/90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal">
          <PenSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-slate/10 flex items-center justify-around z-40 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/app/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] space-y-1 transition-colors",
                isActive ? "text-teal" : "text-slate hover:text-midnight"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "fill-teal/20" : "")} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
