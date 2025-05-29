
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  setAuthenticated: (value: boolean) => void;
  setNeedsOnboarding: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboardingState] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const onboardingStatus = localStorage.getItem("needsOnboarding") === "true";
    setIsAuthenticated(authStatus);
    setNeedsOnboardingState(onboardingStatus);
  }, []);

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
    localStorage.setItem("isAuthenticated", value.toString());
  };

  const setNeedsOnboarding = (value: boolean) => {
    setNeedsOnboardingState(value);
    localStorage.setItem("needsOnboarding", value.toString());
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("needsOnboarding");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setNeedsOnboardingState(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      needsOnboarding,
      setAuthenticated,
      setNeedsOnboarding,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
