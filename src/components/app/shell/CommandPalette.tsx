"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, FileText, User, Briefcase, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "/") {
        // Prevent if we're in an input
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) return;
        
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4 animate-in fade-in duration-200" onClick={() => setOpen(false)}>
      <Command 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200" 
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Search leads, clients, cases, loans..." 
            className="w-full bg-transparent border-0 h-14 px-3 outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button onClick={() => setOpen(false)} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            ESC
          </button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-slate-500">No results found.</Command.Empty>

          <Command.Group heading="Leads" className="text-xs font-semibold text-slate-500 px-2 py-1 [&_[cmdk-group-items]]:space-y-1">
            <Command.Item className="flex items-center gap-3 px-3 py-2 text-sm rounded-md aria-selected:bg-slate-100 cursor-pointer">
              <FileText className="h-4 w-4 text-[#1B7F8E]" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">LD-2410-082 • Acme Corp Expansion</span>
                <span className="text-xs text-slate-500">Working Capital • ₹5Cr</span>
              </div>
            </Command.Item>
            <Command.Item className="flex items-center gap-3 px-3 py-2 text-sm rounded-md aria-selected:bg-slate-100 cursor-pointer">
              <FileText className="h-4 w-4 text-[#1B7F8E]" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">LD-2409-105 • Sharma Real Estate</span>
                <span className="text-xs text-slate-500">LAP • ₹2.5Cr</span>
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Clients" className="text-xs font-semibold text-slate-500 px-2 py-1 mt-2 [&_[cmdk-group-items]]:space-y-1">
            <Command.Item className="flex items-center gap-3 px-3 py-2 text-sm rounded-md aria-selected:bg-slate-100 cursor-pointer">
              <User className="h-4 w-4 text-[#E2A62B]" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">C-1804 • TechGrow Solutions Pvt Ltd</span>
                <span className="text-xs text-slate-500">Mumbai • IT Services</span>
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Cases" className="text-xs font-semibold text-slate-500 px-2 py-1 mt-2 [&_[cmdk-group-items]]:space-y-1">
            <Command.Item className="flex items-center gap-3 px-3 py-2 text-sm rounded-md aria-selected:bg-slate-100 cursor-pointer">
              <Briefcase className="h-4 w-4 text-[#101A3D]" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">CS-9021 • TechGrow CC Facility</span>
                <span className="text-xs text-slate-500">In Login • HDFC Bank</span>
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Loans" className="text-xs font-semibold text-slate-500 px-2 py-1 mt-2 [&_[cmdk-group-items]]:space-y-1">
            <Command.Item className="flex items-center gap-3 px-3 py-2 text-sm rounded-md aria-selected:bg-slate-100 cursor-pointer">
              <FileCode2 className="h-4 w-4 text-green-600" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">LN-4420 • HDFC CC A/c 5029</span>
                <span className="text-xs text-slate-500">Active • Disbursed 12 Aug 2024</span>
              </div>
            </Command.Item>
          </Command.Group>

        </Command.List>
      </Command>
    </div>
  );
}
