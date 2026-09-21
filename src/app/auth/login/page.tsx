"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Lock,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email address."),
  password: z.string().min(4, "Password must be at least 4 characters long."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signOut, user, profile, isAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@fintara.capital",
      password: "Admin@1234",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setAuthError(error);
        return;
      }
      // Redirect based on role
      const cleanEmail = data.email.trim().toLowerCase();
      const isAdminLogin =
        cleanEmail.includes("admin") || cleanEmail.includes("owner");
      if (isAdminLogin) {
        router.push("/app/admin/dashboard/");
      } else {
        router.push("/app/");
      }
    } catch {
      setAuthError("Something went wrong during sign-in. Please try again.");
    }
  };

  const handleQuickLogin = async (
    email: string,
    pass: string,
    label: string,
    targetRole: "admin" | "staff"
  ) => {
    setAuthError(null);
    setIsQuickLoggingIn(label);
    setValue("email", email);
    setValue("password", pass);
    try {
      const { error } = await signIn(email, pass);
      if (error) {
        setAuthError(error);
        setIsQuickLoggingIn(null);
        return;
      }
      if (targetRole === "admin") {
        router.push("/app/admin/dashboard/");
      } else {
        router.push("/app/");
      }
    } catch {
      setAuthError("Quick sign-in encountered an issue. Try again.");
      setIsQuickLoggingIn(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Navigation back to website */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-midnight transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Site
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal/10 text-teal border border-teal/20">
            <Lock className="w-3 h-3" />
            Single Unified Portal
          </span>
        </div>

        {/* Brand Lockup */}
        <div className="flex justify-center">
          <Link href="/" className="h-12 flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-xl shadow-xs"
            />
            <div>
              <span className="text-2xl font-bold tracking-tight text-midnight">
                Fintara<span className="text-slate font-normal ml-1">Capital</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-teal">
                Loan Desk Operations
              </span>
            </div>
          </Link>
        </div>

        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-midnight">
          Sign In to Fintara Desk
        </h2>
        <p className="mt-1 text-center text-xs text-slate max-w-sm mx-auto">
          One login for both Owner / Admin and Staff Loan Officers. Role-based controls load automatically.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface py-7 px-5 shadow-sm sm:rounded-2xl sm:px-8 border border-slate/15">
          {/* Active Session Notification / Switch Account */}
          {user && profile && (
            <div className="mb-5 rounded-xl bg-emerald-50/80 p-4 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  Currently Signed In
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Signed in as <strong>{profile.full_name}</strong> (
                <span className="capitalize font-mono font-bold text-[11px]">
                  {profile.role === "admin" ? "Owner / Admin" : "Staff Officer"}
                </span>
                ) &bull; <span className="font-mono">{user.email}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={isAdmin ? "/app/admin/dashboard/" : "/app/"}
                  className="flex-1 py-2 px-3 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  Enter Desk
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="py-2 px-3 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold hover:bg-emerald-100/50 transition-colors flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-emerald-700" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3.5 border border-rose-200">
              <p className="text-xs font-medium text-rose-800">{authError}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-midnight mb-1"
              >
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@fintara.capital or staff@fintara.capital"
                {...register("email")}
                className={cn(
                  "block w-full rounded-xl border border-slate/20 py-2.5 px-3.5 text-xs text-midnight bg-paper/30 shadow-2xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal min-h-[44px]",
                  errors.email ? "border-rose-300 focus:ring-rose-500" : ""
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-midnight"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your desk password"
                  {...register("password")}
                  className={cn(
                    "block w-full rounded-xl border border-slate/20 py-2.5 px-3.5 pr-10 text-xs text-midnight bg-paper/30 shadow-2xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal min-h-[44px]",
                    errors.password ? "border-rose-300 focus:ring-rose-500" : ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate hover:text-midnight focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!isQuickLoggingIn}
              className="w-full min-h-[44px] mt-2 justify-center items-center rounded-xl bg-midnight px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-midnight/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight disabled:opacity-60 transition-all flex gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
              ) : (
                <>
                  <span>Sign in to Loan Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </>
              )}
            </button>
          </form>

          {/* Clean Credentials Box & 1-Click Fast Fill */}
          <div className="mt-6 border-t border-slate/15 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
                1-Tap Demo Sign-In
              </span>
              <span className="text-[10px] text-slate font-medium">Click to auto-fill &amp; enter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Admin Button */}
              <button
                type="button"
                disabled={isSubmitting || !!isQuickLoggingIn}
                onClick={() =>
                  handleQuickLogin(
                    "admin@fintara.capital",
                    "Admin@1234",
                    "Admin",
                    "admin"
                  )
                }
                className="p-3 text-left rounded-xl border border-midnight/20 hover:border-midnight bg-paper/50 hover:bg-midnight hover:text-white transition-all group disabled:opacity-50 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs group-hover:text-gold text-midnight">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                    <span>Admin (Owner)</span>
                  </div>
                  {isQuickLoggingIn === "Admin" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-gold" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
                <p className="text-[10px] text-slate group-hover:text-white/80 mt-1 font-mono">
                  admin@fintara.capital
                </p>
                <p className="text-[10px] text-slate/70 group-hover:text-white/60 font-mono">
                  Pass: Admin@1234
                </p>
              </button>

              {/* Staff Button */}
              <button
                type="button"
                disabled={isSubmitting || !!isQuickLoggingIn}
                onClick={() =>
                  handleQuickLogin(
                    "staff@fintara.capital",
                    "Staff@1234",
                    "Staff",
                    "staff"
                  )
                }
                className="p-3 text-left rounded-xl border border-teal/30 hover:border-teal bg-paper/50 hover:bg-teal hover:text-white transition-all group disabled:opacity-50 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-teal group-hover:text-white">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Staff Officer</span>
                  </div>
                  {isQuickLoggingIn === "Staff" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
                <p className="text-[10px] text-slate group-hover:text-white/80 mt-1 font-mono">
                  staff@fintara.capital
                </p>
                <p className="text-[10px] text-slate/70 group-hover:text-white/60 font-mono">
                  Pass: Staff@1234
                </p>
              </button>
            </div>

            {/* Credential Reference Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate space-y-1">
              <div className="font-bold text-midnight text-xs flex items-center gap-1">
                <span>🔑</span> Standard Desk Credentials:
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <div>
                  <strong className="text-midnight block">Admin / Owner:</strong>
                  <span>admin@fintara.capital</span>
                  <br />
                  <span className="text-slate">Admin@1234</span>
                </div>
                <div>
                  <strong className="text-midnight block">Staff Officer:</strong>
                  <span>staff@fintara.capital</span>
                  <br />
                  <span className="text-slate">Staff@1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
