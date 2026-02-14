import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface Holiday {
  id: string;
  holiday_name: string;
  holiday_date: string;
  holiday_type: string;
  is_optional: boolean;
  description?: string;
}

const UpcomingHolidaysWidget: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingHolidays();
  }, []);

  const fetchUpcomingHolidays = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("company_holidays")
        .select("*")
        .gte("holiday_date", today)
        .order("holiday_date", { ascending: true })
        .limit(3);

      if (error) throw error;
      setHolidays(data || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "National":
        return "🇮🇳";
      case "Festival":
        return "🎉";
      case "Company":
        return "🏢";
      case "Regional":
        return "🗺️";
      default:
        return "📅";
    }
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(dateString);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 14) return `Next week`;
    return `In ${Math.ceil(diffDays / 7)} weeks`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "National":
        return "from-red-400 to-red-600";
      case "Festival":
        return "from-purple-400 to-purple-600";
      case "Company":
        return "from-blue-400 to-blue-600";
      case "Regional":
        return "from-green-400 to-green-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (holidays.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📅</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Holidays
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-gray-600 text-sm">No upcoming holidays</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Holidays
          </h3>
        </div>
        <button
          onClick={() => {
            const event = new CustomEvent("navigate", { detail: "holidays" });
            window.dispatchEvent(event);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {holidays.map((holiday) => {
          const holidayDate = new Date(holiday.holiday_date);

          return (
            <div
              key={holiday.id}
              className="flex items-center gap-4 p-3 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-all"
            >
              {/* Date Box */}
              <div
                className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${getTypeColor(holiday.holiday_type)} rounded-lg flex flex-col items-center justify-center text-white shadow-md`}
              >
                <div className="text-xs font-medium opacity-90">
                  {holidayDate
                    .toLocaleDateString("en-IN", { month: "short" })
                    .toUpperCase()}
                </div>
                <div className="text-2xl font-bold">
                  {holidayDate.getDate()}
                </div>
              </div>

              {/* Holiday Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {getTypeIcon(holiday.holiday_type)}
                  </span>
                  <h4 className="font-semibold text-gray-900 truncate">
                    {holiday.holiday_name}
                  </h4>
                  {holiday.is_optional && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    {holidayDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                    })}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-blue-600">
                    {getDaysUntil(holiday.holiday_date)}
                  </span>
                </div>
                {holiday.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {holiday.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View Full Calendar Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            const event = new CustomEvent("navigate", { detail: "holidays" });
            window.dispatchEvent(event);
          }}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          View Full Holiday Calendar →
        </button>
      </div>
    </div>
  );
};

export default UpcomingHolidaysWidget;
