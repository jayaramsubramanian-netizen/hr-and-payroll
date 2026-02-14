import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const ClockInOutPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTodayAttendance();
    }
  }, [currentUser]);

  const fetchTodayAttendance = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", currentUser.id)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setTodayAttendance(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!currentUser) return;

    setProcessing(true);
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0].substring(0, 5);

      const { data, error } = await supabase
        .from("attendance")
        .insert({
          employee_id: currentUser.id,
          date: today,
          clock_in: time,
          clock_out: null,
          total_hours: 0,
          status: "Present",
          entry_number: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data);
      alert(`✅ Clocked in successfully at ${time}`);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentUser || !todayAttendance) return;

    setProcessing(true);
    try {
      const now = new Date();
      const time = now.toTimeString().split(" ")[0].substring(0, 5);

      // Calculate total hours
      const clockInTime = new Date(`2000-01-01 ${todayAttendance.clock_in}`);
      const clockOutTime = new Date(`2000-01-01 ${time}`);
      const diffMs = clockOutTime.getTime() - clockInTime.getTime();
      const totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

      const { data, error } = await supabase
        .from("attendance")
        .update({
          clock_out: time,
          total_hours: parseFloat(totalHours),
          status: "Present",
          updated_at: new Date().toISOString(),
        })
        .eq("id", todayAttendance.id)
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data);
      alert(
        `✅ Clocked out successfully at ${time}\nTotal hours: ${totalHours}`,
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Attendance System
          </h1>
          <p className="text-gray-600">Welcome, {currentUser?.name}</p>
        </div>

        {/* Clock Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <div
              className="text-6xl font-bold mb-2"
              style={{ color: "#06038D" }}
            >
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-gray-600">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Today's Status
          </h2>

          {todayAttendance ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Clocked In</p>
                    <p className="text-sm text-gray-600">
                      {todayAttendance.clock_in}
                    </p>
                  </div>
                </div>
              </div>

              {todayAttendance.clock_out ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Clocked Out</p>
                      <p className="text-sm text-gray-600">
                        {todayAttendance.clock_out}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#06038D" }}
                    >
                      {todayAttendance.total_hours || "0"} hrs
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
                  <p className="text-yellow-800 font-medium">
                    Don't forget to clock out at the end of your shift!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                You haven't clocked in yet today
              </p>
              <p className="text-sm text-gray-500">
                Click the button below to mark your attendance
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!todayAttendance && (
            <button
              onClick={handleClockIn}
              disabled={processing}
              className="w-full py-6 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ backgroundColor: "#AB2328" }}
            >
              {processing ? "⏳ Processing..." : "🟢 Clock In"}
            </button>
          )}

          {todayAttendance && !todayAttendance.clock_out && (
            <button
              onClick={handleClockOut}
              disabled={processing}
              className="w-full py-6 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ backgroundColor: "#06038D" }}
            >
              {processing ? "⏳ Processing..." : "🔴 Clock Out"}
            </button>
          )}

          {todayAttendance && todayAttendance.clock_out && (
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
              <p className="text-green-800 font-semibold text-lg">
                ✅ You're all set for today!
              </p>
              <p className="text-green-700 text-sm mt-2">
                Have a great rest of your day
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClockInOutPage;
