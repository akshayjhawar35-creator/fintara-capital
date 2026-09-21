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
      const hasSupabase =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      // Demo dev accounts (SPEC App6) or local demo mode
      if (
        !hasSupabase ||
        email === "owner@fintara.test" ||
        email === "staff1@fintara.test" ||
        email.endsWith("@fintara.test")
      ) {
        const isStaff = email.includes("staff");
        const demoUser = {
          id: isStaff ? "staff-1-uuid" : "owner-uuid",
          email,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        const demoProfile: Profile = {
          id: demoUser.id,
          full_name: isStaff ? "Staff 1" : "Owner (Admin)",
          email,
          mobile: isStaff ? "9800000002" : "9800000001",
          role: isStaff ? "staff" : "admin",
          team_label: isStaff ? "Staff 1" : "Owner",
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

      try {
        const { error } = await getSupabase().auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }
        return { error: null };
      } catch (err: unknown) {
        return {
          error: err instanceof Error ? err.message : "Authentication service unavailable.",
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
