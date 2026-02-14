import React, { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LoadingScreen from "./LoadingScreen";

const KioskModePage: React.FC = () => {
  const [mode, setMode] = useState<"home" | "manual" | "camera" | "success">(
    "home",
  );
  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionType, setActionType] = useState<"in" | "out">("in");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Current time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch recent activity
  useEffect(() => {
    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("attendance")
        .select(
          `
          id,
          employee_id,
          clock_in,
          clock_out,
          entry_number,
          created_at,
          users (name)
        `,
        )
        .eq("date", today)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      setRecentActivity(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("❌ Could not access camera. Please use Employee ID instead.");
      setMode("home");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleManualEntry = async () => {
    if (!employeeId.trim()) {
      alert("Please enter your Employee ID");
      return;
    }
    await processClockInOut(employeeId.toUpperCase());
  };

  const processClockInOut = async (empId: string) => {
    setLoading(true);
    try {
      // Verify employee exists
      const { data: employee, error: empError } = await supabase
        .from("users")
        .select("*")
        .eq("id", empId)
        .single();

      if (empError || !employee) {
        alert("❌ Employee ID not found. Please try again.");
        setLoading(false);
        return;
      }

      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0].substring(0, 5);

      // Get all today's entries for this employee
      const { data: todayEntries, error: entriesError } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", empId)
        .eq("date", today)
        .order("entry_number", { ascending: false });

      if (entriesError) throw entriesError;

      // Find if there's an open entry (clock_in but no clock_out)
      const openEntry = todayEntries?.find((e) => e.clock_in && !e.clock_out);

      if (openEntry) {
        // Clock OUT
        const clockInTime = new Date(`2000-01-01 ${openEntry.clock_in}`);
        const clockOutTime = new Date(`2000-01-01 ${time}`);
        const diffMs = clockOutTime.getTime() - clockInTime.getTime();
        const totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

        const { error: updateError } = await supabase
          .from("attendance")
          .update({
            clock_out: time,
            total_hours: parseFloat(totalHours),
            updated_at: new Date().toISOString(),
          })
          .eq("id", openEntry.id);

        if (updateError) throw updateError;

        setActionType("out");
        setSuccessMessage(
          `CLOCKED OUT\n${employee.name}\n${time}\nSession: ${totalHours} hrs`,
        );
      } else {
        // Clock IN - Create new entry
        const nextEntryNumber =
          todayEntries && todayEntries.length > 0
            ? Math.max(...todayEntries.map((e) => e.entry_number || 1)) + 1
            : 1;

        const { error: insertError } = await supabase
          .from("attendance")
          .insert({
            id: `ATT-${empId}-${today}-${nextEntryNumber}`,
            employee_id: empId,
            date: today,
            clock_in: time,
            status: "Present",
            entry_number: nextEntryNumber,
          });

        if (insertError) throw insertError;

        setActionType("in");
        setSuccessMessage(
          `CLOCKED IN\n${employee.name}\n${time}\n${nextEntryNumber > 1 ? `Entry #${nextEntryNumber}` : "Have a great day!"}`,
        );
      }

      setMode("success");
      fetchRecentActivity();

      // Auto-reset after 4 seconds
      setTimeout(() => {
        resetKiosk();
      }, 4000);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetKiosk = () => {
    setMode("home");
    setEmployeeId("");
    stopCamera();
    setSuccessMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ========================================
  // GUARD CLAUSES - RETURN EARLY IF CONDITIONS MET
  // ========================================

  // Show initial loading screen
  if (initialLoad) {
    return <LoadingScreen message="Loading Kiosk Terminal..." />;
  }

  // Show processing screen
  if (loading) {
    return <LoadingScreen message="Processing your attendance..." />;
  }

  // Success Screen
  if (mode === "success") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          actionType === "in"
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : "bg-gradient-to-br from-blue-500 to-indigo-600"
        }`}
      >
        <div className="text-center">
          <div className="text-9xl mb-8 animate-bounce">
            {actionType === "in" ? "✓" : "●"}
          </div>
          <div className="text-white text-5xl font-bold whitespace-pre-line leading-tight">
            {successMessage}
          </div>
        </div>
      </div>
    );
  }

  // Camera Screen
  if (mode === "camera") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Face Recognition
            </h2>
            <p className="text-slate-600">
              Position your face within the frame
            </p>
          </div>

          <div className="relative bg-slate-100 rounded-2xl p-4 mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-xl w-full"
              style={{ maxWidth: "640px", maxHeight: "480px" }}
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-blue-500 rounded-full w-64 h-64 opacity-40 animate-pulse"></div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                stopCamera();
                setMode("manual");
                alert("📸 Photo captured! Please confirm your Employee ID.");
              }}
              disabled={!cameraActive}
              className="flex-1 px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              📸 Capture & Verify
            </button>
            <button
              onClick={resetKiosk}
              className="px-8 py-4 bg-slate-200 text-slate-700 text-xl font-semibold rounded-xl hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Manual Entry Screen
  if (mode === "manual") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏭</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Enter Employee ID
            </h2>
            <p className="text-slate-600">Type or use the keypad below</p>
          </div>

          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleManualEntry()}
            placeholder="EMP001"
            className="w-full px-6 py-5 text-3xl text-center border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 mb-6 font-mono font-bold uppercase tracking-wider"
            autoFocus
            maxLength={10}
          />

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "⌫"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "CLR") setEmployeeId("");
                  else if (key === "⌫")
                    setEmployeeId((prev) => prev.slice(0, -1));
                  else setEmployeeId((prev) => prev + key);
                }}
                className="px-4 py-6 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-2xl font-bold rounded-xl transition-all shadow-sm"
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleManualEntry}
              disabled={loading || !employeeId}
              className="flex-1 px-6 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Processing..." : "✓ Continue"}
            </button>
            <button
              onClick={resetKiosk}
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home Screen - Professional Corporate Design
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                AVLM EL-MEC Attendance System
              </h1>
              <p className="text-slate-600 mt-1">
                Employee Self-Service Terminal
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600 tabular-nums">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-3">Welcome</h2>
          <p className="text-2xl text-slate-600">
            Please select your preferred method to clock in or out
          </p>
          <div className="mt-4 inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            💡 You can clock in/out multiple times per day for breaks
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={() => setMode("manual")}
            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl p-12 transition-all transform hover:scale-105 border-2 border-slate-200 hover:border-blue-400 group"
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
              🔢
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              Enter Employee ID
            </h3>
            <p className="text-lg text-slate-600">
              Type your ID using the on-screen keypad
            </p>
          </button>

          <button
            onClick={() => {
              setMode("camera");
              setTimeout(startCamera, 100);
            }}
            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl p-12 transition-all transform hover:scale-105 border-2 border-slate-200 hover:border-blue-400 group"
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
              📸
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              Face Recognition
            </h3>
            <p className="text-lg text-slate-600">
              Use camera for quick identification
            </p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              📋 Recent Activity
            </h3>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Live Updates
            </span>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">⏰</div>
                <p className="text-slate-500 text-lg">
                  No activity recorded today
                </p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {activity.users?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2) || "?"}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {activity.users?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-600 font-mono">
                        {activity.clock_in && `In: ${activity.clock_in}`}
                        {activity.clock_out && ` • Out: ${activity.clock_out}`}
                        {activity.entry_number > 1 &&
                          ` (Entry #${activity.entry_number})`}
                      </p>
                    </div>
                  </div>
                  <div>
                    {activity.clock_out ? (
                      <span className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold shadow-sm">
                        ✓ Complete
                      </span>
                    ) : (
                      <span className="px-5 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold shadow-sm animate-pulse">
                        ● Active
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-white bg-opacity-50 hover:bg-opacity-100 text-slate-600 rounded-lg transition-all text-sm shadow-md"
        >
          ← Exit Kiosk Mode
        </button>
      </div>
    </div>
  );
};

export default KioskModePage;
