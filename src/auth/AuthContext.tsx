import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Role } from "../rbac";

interface CurrentUser {
  id: string;
  role: Role;
  name: string;
  department: string;
  personal_email?: string;
  mobile_number?: string;
  casual_leave_balance?: number;
  sick_leave_balance?: number;
  earned_leave_balance?: number;
  unpaid_leave_taken?: number;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  login: (employeeId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          const user = JSON.parse(stored);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const login = async (employeeId: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", employeeId.toUpperCase())
        .single();

      console.log("Login attempt:", { employeeId, data, error });

      if (error || !data) {
        console.error("Login error:", error);
        setIsLoading(false);
        return false;
      }

      // Create user object with all necessary fields including leave balances
      const user: CurrentUser = {
        id: data.id,
        role: data.role as Role,
        name: data.name,
        department: data.department,
        personal_email: data.personal_email,
        mobile_number: data.mobile_number,
        casual_leave_balance: data.casual_leave_balance,
        sick_leave_balance: data.sick_leave_balance,
        earned_leave_balance: data.earned_leave_balance,
        unpaid_leave_taken: data.unpaid_leave_taken,
      };

      console.log("User logged in:", user);

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login exception:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
