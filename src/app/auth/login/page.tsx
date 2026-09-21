"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(10, "Password must be at least 10 characters long."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setAuthError("Wrong email or password. Check and try again.");
        return;
      }
      router.push("/app/");
    } catch {
      setAuthError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-2xl font-serif font-semibold text-midnight">
              Fintara
            </span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold tracking-tight text-midnight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate">
          Loans, arranged across lenders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate/10">

          {authError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{authError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-midnight">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "block w-full rounded-md border-0 py-2.5 px-3 text-midnight shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 min-h-[44px]",
                    errors.email ? "ring-red-300 focus:ring-red-500" : "ring-slate/30 focus:ring-teal"
                  )}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-midnight">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-midnight shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 min-h-[44px]",
                    errors.password ? "ring-red-300 focus:ring-red-500" : "ring-slate/30 focus:ring-teal"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 min-h-[44px] min-w-[44px] justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md text-slate/60 hover:text-slate"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm leading-6">
                <a href="#" className="font-semibold text-teal hover:text-teal/80 min-h-[44px] flex items-center">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full min-h-[44px] justify-center items-center rounded-md bg-midnight px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-midnight/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
