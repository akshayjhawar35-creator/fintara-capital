"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, isLoading: isAuthLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState<string | null>(null);

  // If already logged in, redirect straight to staff CRM
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace("/app/");
    }
  }, [isAuthLoading, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "owner@fintara.test",
      password: "DemoAdminPass123",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setAuthError(error || "Wrong email or password. Check and try again.");
        return;
      }
      router.push("/app/");
    } catch {
      setAuthError("Something went wrong. Please try again.");
    }
  };

  const handleQuickLogin = async (email: string, pass: string, label: string) => {
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
      router.push("/app/");
    } catch {
      setAuthError("Sign-in encountered an issue. Try again.");
      setIsQuickLoggingIn(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-between px-4 sm:px-0 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate hover:text-midnight transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Fintara Home
          </Link>
          <span className="text-xs text-slate font-mono">Staff Portal</span>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="h-12 flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-2xl font-serif font-semibold text-midnight">
              Fintara<span className="text-slate font-normal text-xl ml-1">Capital</span>
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold tracking-tight text-midnight">
          Sign in to Loan Desk
        </h2>
        <p className="mt-2 text-center text-sm text-slate">
          Raipur CRM &bull; Loans, arranged across lenders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate/15">
          {authError && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-200">
              <p className="text-xs font-medium text-red-800">{authError}</p>
            </div>
          )}

          {user && (
            <div className="mb-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Signed in as <strong>{user.email}</strong>. Redirecting...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium leading-6 text-midnight">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "block w-full rounded-xl border border-slate/20 py-2.5 px-3 text-xs text-midnight shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal min-h-[44px]",
                    errors.email ? "border-red-300 focus:ring-red-500" : ""
                  )}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium leading-6 text-midnight">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "block w-full rounded-xl border border-slate/20 py-2.5 px-3 pr-10 text-xs text-midnight shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal min-h-[44px]",
                    errors.password ? "border-red-300 focus:ring-red-500" : ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 min-h-[44px] min-w-[44px] justify-center text-slate/60 hover:text-slate"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !!isQuickLoggingIn}
                className="flex w-full min-h-[44px] justify-center items-center rounded-xl bg-midnight px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-midnight/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gold" />
                ) : (
                  "Sign in to Staff Desk"
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Logins per Spec App6 */}
          <div className="mt-6 border-t border-slate/15 pt-5">
            <p className="text-xs font-medium text-slate text-center mb-3">
              1-Click Demo Sign-in (Dev &amp; Testing)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting || !!isQuickLoggingIn}
                onClick={() =>
                  handleQuickLogin(
                    "owner@fintara.test",
                    "DemoAdminPass123",
                    "Admin"
                  )
                }
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-midnight text-midnight hover:bg-midnight hover:text-white transition-colors text-center disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {isQuickLoggingIn === "Admin" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                Admin (Owner)
              </button>
              <button
                type="button"
                disabled={isSubmitting || !!isQuickLoggingIn}
                onClick={() =>
                  handleQuickLogin(
                    "staff1@fintara.test",
                    "DemoStaffPass123",
                    "Staff"
                  )
                }
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-teal text-teal hover:bg-teal hover:text-white transition-colors text-center disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {isQuickLoggingIn === "Staff" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                Staff Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
