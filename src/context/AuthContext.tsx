import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) { console.error('Error fetching profile:', error); return; }
    setProfile(data as UserProfile | null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); setUser(s?.user ?? null);
      if (s?.user) { fetchProfile(s.user.id).finally(() => setLoading(false)); } else { setLoading(false); }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s); setUser(s?.user ?? null);
      if (s?.user) { fetchProfile(s.user.id); } else { setProfile(null); }
      setLoading(false);
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  async function signUp(email: string, password: string, fullName: string, username: string) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, username } } });
    if (error) return { error: error.message };
    if (data.user) { await fetchProfile(data.user.id); }
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) { await fetchProfile(data.user.id); }
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null); setUser(null); setSession(null);
  }

  async function refreshProfile() { if (user) { await fetchProfile(user.id); } }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
