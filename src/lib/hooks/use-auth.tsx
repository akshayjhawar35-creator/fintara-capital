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
    const { data, error } = await getSupabase()
      .from("profiles")
      .select("id, full_name, email, mobile, role, team_label, is_active")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
    return data as Profile;
  }, []);

  useEffect(() => {
    // Get initial session
    getSupabase().auth.getSession().then(async ({ data: { session: s } }) => {
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
          } catch (e) { /* ignore */ }
        }
      }
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

  // Idle timeout — check session age periodically
  useEffect(() => {
    if (!session) return;

    const checkIdle = () => {
      // Session idle check would use last activity timestamp
      // For now, rely on Supabase's built-in session expiry
    };

    const interval = setInterval(checkIdle, 60_000);
    return () => clearInterval(interval);
  }, [session]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      // Demo dev accounts support (SPEC App6)
      if (email === "owner@fintara.test" || email === "staff1@fintara.test" || email.endsWith("@fintara.test")) {
        const isOwner = email.includes("owner");
        const demoUser = {
          id: isOwner ? "owner-uuid" : "staff-1-uuid",
          email,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        const demoProfile: Profile = {
          id: demoUser.id,
          full_name: isOwner ? "Owner (Admin)" : "Staff 1",
          email,
          mobile: isOwner ? "9800000001" : "9800000002",
          role: isOwner ? "admin" : "staff",
          team_label: isOwner ? "Owner" : "Staff 1",
          is_active: true,
        };
        setUser(demoUser);
        setProfile(demoProfile);
        if (typeof window !== "undefined") {
          localStorage.setItem("fintara_demo_user", JSON.stringify({ user: demoUser, profile: demoProfile }));
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
      } catch (err: any) {
        return { error: err?.message || "Authentication service unavailable." };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const signOutAllDevices = useCallback(async () => {
    await getSupabase().auth.signOut({ scope: "global" });
    setUser(null);
    setProfile(null);
    setSession(null);
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
