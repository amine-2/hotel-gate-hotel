import { createContext, useContext, useEffect, useState } from "react";
import {
  signIn,
  signOut,
  getSession,
  getProfile,
} from "../services/authService";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const init = async () => {
    const { data } = await getSession();
    const user = data.session?.user || null;
    setUser(user);

    if (user) await fetchProfile(user.id);
    else setLoading(false);
  };

  const fetchProfile = async (id) => {
    const { data, error } = await getProfile(id);

    if (error) {
      console.error("Failed to fetch profile:", error);
      await signOut();
      setUser(null);
      setProfile(null);
      setAuthError("Failed to fetch profile");
      setLoading(false);

      return;
    }

    if (!data?.hotel_id) {
      console.warn("User does not belong to a hotel.");
      await signOut();
      setUser(null);
      setProfile(null);
      setAuthError("User does not belong to a hotel.");
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  const login = async (email, password) => {
    return await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, loading, authError  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
