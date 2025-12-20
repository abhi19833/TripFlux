import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth");
        setUser(res.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const signUp = async (username, email, password) => {
    try {
      const res = await api.post("/auth/signup", { username, email, password });
      localStorage.setItem("token", res.data.token);

      const userRes = await api.get("/auth");
      setUser(userRes.data);

      return { data: res.data, error: null };
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      return { data: null, error: err.response?.data || err.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const userRes = await api.get("/auth");
      setUser(userRes.data);

      return { data: res.data, error: null };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { data: null, error: err.response?.data || err.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: "No user logged in" };

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    return { data: updatedProfile, error: null };
  };

  const loadProfile = async (userId) => {
    try {
      const res = await api.get(`/profile/${userId}`);
      setProfile(res.data);
      return { data: res.data, error: null };
    } catch (err) {
      console.error("Failed to load profile:", err);
      return { data: null, error: err };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
