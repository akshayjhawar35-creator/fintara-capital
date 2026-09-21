"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import {
  UserCog,
  Shield,
  Target,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Plus,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "staff";
  team_label: string;
  is_active: boolean;
  monthly_target: number; // Rule R26
  current_achieved: number;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "usr-owner",
      name: "Fintara Owner",
      email: "owner@fintara.test",
      mobile: "9826010001",
      role: "admin",
      team_label: "Owner",
      is_active: true,
      monthly_target: 6000000,
      current_achieved: 6000000, // LN-0002 ₹60L
    },
    {
      id: "usr-staff1",
      name: "Staff 1 (Loan Officer)",
      email: "staff1@fintara.test",
      mobile: "9826010002",
      role: "staff",
      team_label: "Staff 1",
      is_active: true,
      monthly_target: 4000000,
      current_achieved: 2500000, // LN-0001 ₹25L
    },
  ]);

  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState<number>(4000000);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveTarget = (id: string) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, monthly_target: targetInput } : m))
    );
    setEditingTargetId(null);
    setToastMsg("Monthly target updated successfully.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleActive = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (member?.role === "admin") {
      alert("The Owner / Admin account cannot be deactivated.");
      return;
    }

    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
    setToastMsg(
      member?.is_active
        ? `Staff account ${member?.name} deactivated. Active cases will be routed to Owner.`
        : `Staff account ${member?.name} reactivated.`
    );
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-semibold text-midnight">
              Team Management &amp; Targets
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-midnight text-white text-[10px] font-mono uppercase tracking-wider">
              <Shield className="w-3 h-3 text-gold" />
              Owner Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Staff user administration, role-based access control, and individual monthly disbursal targets (Rule R26).
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-teal/10 border border-teal/20 rounded-xl text-xs text-teal font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {team.map((member) => {
          const percent = Math.min(100, Math.round((member.current_achieved / member.monthly_target) * 100));

          return (
            <div
              key={member.id}
              className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between pb-3 border-b border-slate/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-midnight text-base">
                        {member.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          member.role === "admin"
                            ? "bg-midnight text-white"
                            : "bg-teal/10 text-teal"
                        }`}
                      >
                        {member.team_label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate/70" />
                        {member.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate/70" />
                        +91 {member.mobile}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      member.is_active
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-crimson/10 text-crimson"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Target Progress Bar (Rule R26) */}
                <div className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate font-medium flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-teal" />
                      Monthly Target (Rule R26)
                    </span>
                    <span className="font-bold text-midnight font-mono">
                      {formatINR(member.monthly_target)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-paper rounded-full overflow-hidden border border-slate/15">
                    <div
                      className="h-full bg-linear-to-r from-teal to-gold rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate">
                    <span>Disbursed: <strong className="text-midnight">{formatINR(member.current_achieved)}</strong></span>
                    <span className="font-semibold text-teal">{percent}% Achieved</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate/10 flex items-center justify-between text-xs">
                {editingTargetId === member.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="number"
                      step="500000"
                      value={targetInput}
                      onChange={(e) => setTargetInput(Number(e.target.value))}
                      className="w-32 px-2 py-1 text-xs border border-slate/20 rounded bg-paper font-mono"
                    />
                    <button
                      onClick={() => handleSaveTarget(member.id)}
                      className="px-2.5 py-1 bg-midnight text-white text-xs font-semibold rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTargetId(null)}
                      className="px-2 py-1 text-xs text-slate hover:text-midnight"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingTargetId(member.id);
                        setTargetInput(member.monthly_target);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate/20 bg-paper text-slate hover:text-midnight font-medium flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3 text-teal" />
                      <span>Adjust Target</span>
                    </button>

                    {member.role !== "admin" && (
                      <button
                        onClick={() => handleToggleActive(member.id)}
                        className={`px-2.5 py-1.5 rounded-lg font-medium ${
                          member.is_active
                            ? "text-crimson hover:bg-crimson/10"
                            : "text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {member.is_active ? "Deactivate Account" : "Reactivate"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
