import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { setUserContextForRLS, clearUserContextForRLS } from "./utils/rls";

interface CurrentUser {
  id: string;
  role: string;
  name: string;
  department: string;
  email: string;
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
  login: (emailOrId: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setUserContextForRLS(user.id);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);
  const login = async (
    emailOrId: string,
    password?: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const isEmail = emailOrId.includes("@");
      let userData = null;

      if (isEmail && password) {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: emailOrId,
            password,
          });

        if (authError || !authData.user) {
          console.error("Auth error:", authError);
          return false;
        }

        const { data: userRecord, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("personal_email", emailOrId)
          .single();

        if (userError || !userRecord) {
          console.error("User record not found:", userError);
          await supabase.auth.signOut();
          alert("User record not found in system. Please contact HR.");
          return false;
        }

        userData = userRecord;
      } else {
        const { data: userRecord, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", emailOrId)
          .single();

        if (error || !userRecord) {
          console.error("User not found:", error);
          return false;
        }

        userData = userRecord;
      }

      if (!userData) {
        return false;
      }

      // CRITICAL: Set RLS context BEFORE any other queries
      console.log("Setting RLS context for user:", userData.id);
      await setUserContextForRLS(userData.id);

      // Verify it was set
      const { data: contextCheck } = await supabase.rpc(
        "get_current_user_context",
      );
      console.log("RLS context set to:", contextCheck);

      const user: CurrentUser = {
        id: userData.id,
        role: userData.role,
        name: userData.name,
        department: userData.department,
        email: userData.personal_email || "",
        personal_email: userData.personal_email,
        mobile_number: userData.mobile_number,
        casual_leave_balance: userData.casual_leave_balance,
        sick_leave_balance: userData.sick_leave_balance,
        earned_leave_balance: userData.earned_leave_balance,
        unpaid_leave_taken: userData.unpaid_leave_taken,
      };

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Log login to audit trail
      await supabase.from("audit_log").insert({
        user_id: user.id,
        user_email: user.email,
        action: "LOGIN",
        table_name: "auth",
        module: "authentication",
      });

      return true;
    } catch (error) {
      console.error("Login exception:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        // Log logout to audit trail
        await supabase.from("audit_log").insert({
          user_id: currentUser.id,
          user_email: currentUser.email,
          action: "LOGOUT",
          table_name: "auth",
          module: "authentication",
        });
      }

      await clearUserContextForRLS();
      await supabase.auth.signOut();
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
