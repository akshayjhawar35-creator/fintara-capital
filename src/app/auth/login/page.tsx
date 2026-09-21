"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useAuth } from "@/lib/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(10, "Password must be at least 10 characters long."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  // const { login } = useAuth();
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // await login(data.email, data.password);
      router.push("/app");
    } catch (error) {
      setAuthError("Wrong email or password. Check and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 flex items-center gap-3">
             <div className="h-10 w-10 bg-[#101A3D] rounded-md flex items-center justify-center text-white font-bold text-lg">FC</div>
             <span className="text-2xl font-newsreader font-semibold text-[#101A3D]">Fintara</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-newsreader font-semibold tracking-tight text-[#101A3D]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#475069]">
          Loans, arranged across lenders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          
          {authError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{authError}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 min-h-[44px]",
                    errors.email ? "ring-red-300 focus:ring-red-500" : "ring-slate-300 focus:ring-[#1B7F8E]"
                  )}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 min-h-[44px]",
                    errors.password ? "ring-red-300 focus:ring-red-500" : "ring-slate-300 focus:ring-[#1B7F8E]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 min-h-[44px] min-w-[44px] justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1B7F8E] rounded-md text-slate-400 hover:text-slate-600"
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
                <a href="#" className="font-semibold text-[#1B7F8E] hover:text-[#15606c] min-h-[44px] flex items-center">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full min-h-[44px] justify-center items-center rounded-md bg-[#101A3D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1a2859] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101A3D] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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
