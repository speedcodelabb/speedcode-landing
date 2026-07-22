import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_SESSION_KEY = 'speedcode-admin-demo-session';

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthenticated(sessionStorage.getItem(DEMO_SESSION_KEY) === '1');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      if (!email.trim() || !password.trim()) {
        return { error: 'Ingresá un email y una contraseña (modo demo local, cualquier valor sirve).' };
      }
      sessionStorage.setItem(DEMO_SESSION_KEY, '1');
      setIsAuthenticated(true);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    if (!isSupabaseConfigured || !supabase) {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      setIsAuthenticated(false);
      return;
    }
    await supabase.auth.signOut();
  }

  return { isAuthenticated, loading, isDemoMode: !isSupabaseConfigured, signIn, signOut };
}
