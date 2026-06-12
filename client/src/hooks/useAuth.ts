import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";

let initialFetchPromise: Promise<void> | null = null;

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    if (initialFetchPromise) {
      return;
    }

    const fetchMe = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data?.success && response.data?.data?.user) {
          setUser(response.data.data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initialFetchPromise = fetchMe();
  }, [user, setUser, logout, setLoading]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
export default useAuth;
