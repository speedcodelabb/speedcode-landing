import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthState = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  configured: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function checkAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return data === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError("El panel no está configurado para este entorno.");
      setLoading(false);
      return;
    }

    let active = true;
    const resolveSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const authenticated = Boolean(data.session);
        const admin = authenticated ? await checkAdmin() : false;
        if (active) {
          setIsAuthenticated(authenticated);
          setIsAdmin(admin);
          setError(
            authenticated && !admin
              ? "La cuenta no tiene permisos administrativos."
              : null,
          );
        }
      } catch (caught) {
        if (active)
          setError(
            caught instanceof Error
              ? caught.message
              : "No se pudo validar la sesión.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };

    void resolveSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void resolveSession();
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    if (!supabase || !isSupabaseConfigured)
      return { error: "Supabase no está configurado." };
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) return { error: signInError.message };
      if (!(await checkAdmin())) {
        await supabase.auth.signOut();
        return {
          error: "La cuenta no está autorizada para administrar este sitio.",
        };
      }
      setIsAuthenticated(true);
      setIsAdmin(true);
      return { error: null };
    } catch (caught) {
      return {
        error:
          caught instanceof Error
            ? caught.message
            : "No se pudo iniciar sesión.",
      };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
  }

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated,
      isAdmin,
      loading,
      configured: isSupabaseConfigured,
      error,
      signIn,
      signOut,
    }),
    [isAuthenticated, isAdmin, loading, error],
  );
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
