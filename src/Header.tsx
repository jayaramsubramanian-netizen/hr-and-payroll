import React from "react";
import { useAuth } from "./AuthContext";
import logo from "./assets/logo.jpg";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header
      className="bg-white shadow-md border-b-4 fixed top-0 left-0 right-0 z-50"
      style={{ borderBottomColor: "#AB2328" }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="AVLM EL-MEC" className="h-12 w-auto" />
          </div>

          <div className="flex items-center gap-6">
            {currentUser && (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {currentUser.role} • {currentUser.department}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-all"
                  style={{ borderColor: "#AB2328", color: "#AB2328" }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
