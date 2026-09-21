"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileText, User, Briefcase, FileCode2 } from "lucide-react";
import { useData } from "@/lib/data/store";
import { formatINRCompact } from "@/lib/format";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { leads, clients } = useData();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "/") {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        )
          return;

        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-2xl bg-surface rounded-xl shadow-2xl overflow-hidden border border-slate/20"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="flex items-center px-4 border-b border-slate/15">
          <Search className="h-5 w-5 text-slate/50 shrink-0" />
          <Command.Input
            autoFocus
            placeholder="Search leads, clients, cases by name or code..."
            className="w-full bg-transparent border-0 h-14 px-3 outline-none text-midnight placeholder:text-slate/50 text-sm"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-slate bg-paper px-2 py-1 rounded border border-slate/20 font-mono"
          >
            ESC
          </button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 text-xs">
          <Command.Empty className="py-6 text-center text-slate">
            No matching records found.
          </Command.Empty>

          {/* Leads */}
          <Command.Group heading="Leads & Enquiries" className="text-xs font-semibold text-slate px-2 py-1">
            {leads.slice(0, 5).map((l) => (
              <Command.Item
                key={l.id}
                onSelect={() => {
                  setOpen(false);
                  router.push("/app/leads/");
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-paper cursor-pointer"
              >
                <FileText className="h-4 w-4 text-teal" />
                <div className="flex flex-col">
                  <span className="font-semibold text-midnight">
                    {l.lead_code} • {l.name}
                  </span>
                  <span className="text-slate text-[11px]">
                    {l.product_name} • {formatINRCompact(l.amount)} ({l.location_area})
                  </span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Clients */}
          <Command.Group heading="Clients" className="text-xs font-semibold text-slate px-2 py-1 mt-2">
            {clients.map((c) => (
              <Command.Item
                key={c.id}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/app/clients/detail/?id=${c.client_code}`);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-paper cursor-pointer"
              >
                <User className="h-4 w-4 text-gold" />
                <div className="flex flex-col">
                  <span className="font-semibold text-midnight">
                    {c.client_code} • {c.name}
                  </span>
                  <span className="text-slate text-[11px]">
                    {c.client_type} • {c.city_area}, Raipur
                  </span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
