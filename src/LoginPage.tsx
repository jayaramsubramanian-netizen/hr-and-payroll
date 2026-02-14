import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"id" | "email">("id");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let success = false;

    if (loginMethod === "id") {
      // ID-based login
      if (!employeeId) {
        setError("Please enter your Employee ID");
        return;
      }
      success = await login(employeeId);
    } else {
      // Email/Password login
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }
      success = await login(email, password);
    }

    if (!success) {
      setError(
        loginMethod === "id"
          ? "Invalid Employee ID. Please try again."
          : "Invalid email or password. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">AV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AVLM EL-MEC</h1>
          <p className="text-gray-600">Enterprise Resource Planning System</p>
        </div>

        {/* Kiosk Mode Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              window.location.hash = "kiosk";
              window.dispatchEvent(new Event("openKiosk"));
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🏭
            </span>
            <span className="text-lg">Access Kiosk Mode</span>
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            For shop floor employees to clock in/out
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign In
          </h2>

          {/* Login Method Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod("id")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                loginMethod === "id"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Employee ID
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                loginMethod === "email"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Email/Password
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMethod === "id" ? (
              /* Employee ID Login */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="e.g., HR001, EMP001"
                  required
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter your employee ID (e.g., HR001, CEO001, MAN001, EMP001)
                </p>
              </div>
            ) : (
              /* Email/Password Login */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@avlm.com"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-white rounded-lg font-semibold shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ backgroundColor: "#06038D" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Test Credentials */}
          {loginMethod === "id" && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Test Credentials:
              </p>
              <div className="text-xs text-blue-800 space-y-1">
                <div>
                  HR:{" "}
                  <code className="bg-white px-2 py-0.5 rounded">HR001</code>
                </div>
                <div>
                  CEO:{" "}
                  <code className="bg-white px-2 py-0.5 rounded">CEO001</code>
                </div>
                <div>
                  Manager:{" "}
                  <code className="bg-white px-2 py-0.5 rounded">MAN001</code>
                </div>
                <div>
                  Employee:{" "}
                  <code className="bg-white px-2 py-0.5 rounded">EMP001</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure authentication with audit logging
          </p>
          <p className="text-xs text-gray-400 mt-1">
            All connections encrypted • RLS policies active
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
