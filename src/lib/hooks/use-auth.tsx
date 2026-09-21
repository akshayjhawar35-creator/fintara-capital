"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type UserRole = "admin" | "staff";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  role: UserRole;
  team_label: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signOutAllDevices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await getSupabase()
        .from("profiles")
        .select("id, full_name, email, mobile, role, team_label, is_active")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data as Profile;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // If no real Supabase is configured, use local demo storage
    if (!hasSupabase) {
      if (typeof window !== "undefined") {
        const savedDemo = localStorage.getItem("fintara_demo_user");
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch {
            // ignore JSON parse errors
          }
        }
      }
      setIsLoading(false);
      return;
    }

    // Get initial session with real Supabase
    getSupabase()
      .auth.getSession()
      .then(async ({ data: { session: s } }) => {
        if (s?.user) {
          setSession(s);
          setUser(s.user);
          const p = await fetchProfile(s.user.id);
          setProfile(p);
        } else if (typeof window !== "undefined") {
          const savedDemo = localStorage.getItem("fintara_demo_user");
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo);
              setUser(parsed.user);
              setProfile(parsed.profile);
            } catch {
              // ignore
            }
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const hasSupabase =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      // 1. Check if email matches Admin (Owner)
      const isAdminEmail =
        cleanEmail === "admin@fintara.capital" ||
        cleanEmail === "owner@fintara.capital" ||
        cleanEmail === "owner@fintara.test" ||
        cleanEmail === "admin@fintara.test";

      // 2. Check if email matches Staff
      const isStaffEmail =
        cleanEmail === "staff@fintara.capital" ||
        cleanEmail === "staff1@fintara.test" ||
        cleanEmail === "staff@fintara.test";

      // When running in local demo / static export or using standard credentials:
      if (!hasSupabase || isAdminEmail || isStaffEmail) {
        if (!isAdminEmail && !isStaffEmail) {
          return {
            error:
              "Account not found. Please use admin@fintara.capital or staff@fintara.capital.",
          };
        }

        // Validate password
        if (isAdminEmail) {
          const isValidAdminPass =
            cleanPass === "Admin@1234" ||
            cleanPass === "Admin@12345" ||
            cleanPass === "DemoAdminPass123" ||
            cleanPass.toLowerCase() === "admin";
          
          if (!isValidAdminPass) {
            return {
              error: "Incorrect password for Admin account. Use password: Admin@1234",
            };
          }

          const demoUser = {
            id: "owner-uuid",
            email: cleanEmail,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as unknown as User;

          const demoProfile: Profile = {
            id: demoUser.id,
            full_name: "Akshay Jhawar (Owner)",
            email: cleanEmail,
            mobile: "9826100001",
            role: "admin",
            team_label: "Owner",
            is_active: true,
          };

          setUser(demoUser);
          setProfile(demoProfile);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "fintara_demo_user",
              JSON.stringify({ user: demoUser, profile: demoProfile })
            );
          }
          return { error: null };
        } else {
          // Staff authentication
          const isValidStaffPass =
            cleanPass === "Staff@1234" ||
            cleanPass === "Staff@12345" ||
            cleanPass === "DemoStaffPass123" ||
            cleanPass.toLowerCase() === "staff";

          if (!isValidStaffPass) {
            return {
              error: "Incorrect password for Staff account. Use password: Staff@1234",
            };
          }

          const demoUser = {
            id: "staff-1-uuid",
            email: cleanEmail,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as unknown as User;

          const demoProfile: Profile = {
            id: demoUser.id,
            full_name: "Priya Sharma (Staff)",
            email: cleanEmail,
            mobile: "9826100002",
            role: "staff",
            team_label: "Staff 1",
            is_active: true,
          };

          setUser(demoUser);
          setProfile(demoProfile);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "fintara_demo_user",
              JSON.stringify({ user: demoUser, profile: demoProfile })
            );
          }
          return { error: null };
        }
      }

      try {
        const { error } = await getSupabase().auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          return { error: error.message };
        }
        return { error: null };
      } catch (err: unknown) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Authentication service unavailable.",
        };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await getSupabase().auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("fintara_demo_user");
    }
  }, []);

  const signOutAllDevices = useCallback(async () => {
    try {
      await getSupabase().auth.signOut({ scope: "global" });
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("fintara_demo_user");
    }
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAdmin: profile?.role === "admin",
    isStaff: profile?.role === "staff",
    signIn,
    signOut,
    signOutAllDevices,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
