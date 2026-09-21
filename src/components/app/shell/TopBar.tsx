"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Bell, Clock, AlertTriangle, Cake, Check, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatDate } from "@/lib/format";

interface TopBarProps {
  title?: string;
  onSearchClick?: () => void;
}

export function TopBar({ title = "My Day", onSearchClick }: TopBarProps) {
  const { profile, signOut } = useAuth();
  const { leads, cases, clients, today, getFollowupAlert, getCaseAlerts } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Compute live digest notifications
  const notifications = useMemo(() => {
    const list: Array<{ id: string; title: string; desc: string; type: "overdue" | "stuck" | "birthday"; link: string }> = [];

    // Overdue Leads
    leads.forEach((l) => {
      const alert = getFollowupAlert(l.next_followup_on);
      if (alert.alert === "OVERDUE") {
        list.push({
          id: `notif-lead-${l.id}`,
          title: `Overdue Follow-up: ${l.name}`,
          desc: `${l.product_name} lead is overdue by ${alert.daysDiff} days`,
          type: "overdue",
          link: "/app/",
        });
      }
    });

    // Overdue / Stuck Cases
    cases.forEach((c) => {
      const alert = getCaseAlerts(c);
      if (alert.isStuck) {
        list.push({
          id: `notif-stuck-${c.id}`,
          title: `Stuck Case: ${c.case_code} (${c.client_name})`,
          desc: `${alert.daysInStage} days in ${c.primary_submission.stage}`,
          type: "stuck",
          link: `/app/cases/detail?id=${c.case_code}`,
        });
      }
    });

    // Birthdays in next 7 days (Rule R22)
    clients.forEach((cl) => {
      if (cl.dob) {
        const bday = new Date(cl.dob);
        const curr = new Date(today);
        bday.setFullYear(curr.getFullYear());
        const diff = (bday.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 7) {
          list.push({
            id: `notif-bday-${cl.id}`,
            title: `Birthday this week: ${cl.name}`,
            desc: `Send relationship greeting (Rule R22)`,
            type: "birthday",
            link: "/app/",
          });
        }
      }
    });

    return list;
  }, [leads, cases, clients, today, getFollowupAlert, getCaseAlerts]);

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
    <header className="h-14 bg-surface border-b border-slate/10 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-midnight font-serif">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative">
        {/* Search trigger */}
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

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate hover:bg-paper rounded-full relative transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-crimson text-[10px] font-bold text-white ring-2 ring-surface animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl border border-slate/15 shadow-xl p-4 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate/10 pb-2">
                <span className="font-serif font-bold text-midnight text-sm">
                  Alerts &amp; Notifications ({notifications.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate hover:text-midnight font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-slate">
                  No active alerts. All items are on track!
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link}
                      onClick={() => setShowNotifications(false)}
                      className="p-2.5 rounded-xl bg-paper hover:bg-slate/5 border border-slate/10 flex items-start gap-2.5 transition-colors block"
                    >
                      {n.type === "overdue" && (
                        <div className="w-6 h-6 rounded-full bg-crimson/10 text-crimson flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {n.type === "stuck" && (
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {n.type === "birthday" && (
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Cake className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="flex-1">
                        <span className="font-semibold text-midnight block">{n.title}</span>
                        <span className="text-[11px] text-slate mt-0.5 block">{n.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate/10 flex justify-between items-center text-[11px]">
                <span className="text-slate">System Date: {formatDate(today)}</span>
                <Link
                  href="/app/"
                  onClick={() => setShowNotifications(false)}
                  className="font-semibold text-teal hover:underline"
                >
                  View My Day &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate/15 mx-1"></div>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-midnight text-white hover:ring-2 hover:ring-offset-2 hover:ring-midnight transition-all overflow-hidden focus:outline-none"
            title="User Profile"
          >
            <span className="text-sm font-medium">{initials}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface rounded-xl border border-slate/15 shadow-xl p-3 space-y-2 z-50 text-xs">
              <div className="border-b border-slate/10 pb-2">
                <span className="font-bold text-midnight block">{profile?.full_name || "Staff Member"}</span>
                <span className="text-[11px] text-slate block">{profile?.email || "staff@fintara.test"}</span>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-paper text-midnight font-mono text-[10px] uppercase font-bold border border-slate/15">
                  {profile?.team_label || profile?.role || "Staff"}
                </span>
              </div>

              <div className="space-y-1">
                <Link
                  href="/app/admin/settings/"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-2 py-1.5 rounded-lg hover:bg-paper text-slate hover:text-midnight font-medium"
                >
                  Settings &amp; Thresholds
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-crimson/10 text-crimson font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
