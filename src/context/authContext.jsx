import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on app load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        // ✅ Basic validation (avoid corrupted data)
        if (parsedUser?.id && storedToken) {
          setUser(parsedUser);
          setAccessToken(storedToken);
        } else {
          localStorage.clear();
        }
      }
    } catch (err) {
      console.error("Auth restore error:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 Login handler
  const login = (data, remember = true) => {
    if (!data?.user || !data?.accessToken) {
      throw new Error("Invalid login response");
    }

    const { user, accessToken } = data;
    console.log("azz", data);
    setUser(user);
    setAccessToken(accessToken);
    console.log("azzx", remember);
    if (remember) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    }
  };
  console.log("azzx", user, accessToken);

  // 🚪 Logout handler
  const logout = () => {
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  // 🔍 Auth check
  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔌 Hook
export const useAuth = () => useContext(AuthContext);
