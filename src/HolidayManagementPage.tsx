import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoadingScreen from "./components/LoadingScreen";

interface Holiday {
  id: string;
  holiday_name: string;
  holiday_date: string;
  holiday_type: string;
  is_optional: boolean;
  description?: string;
}

const HolidayManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    holiday_type: "National",
    is_optional: false,
    description: "",
  });

  const holidayTypes = ["National", "Regional", "Company", "Festival"];

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      console.log("Fetching holidays...");
      const { data, error } = await supabase
        .from("company_holidays")
        .select("*")
        .order("holiday_date", { ascending: true });

      console.log("Holidays fetch result:", { data, error });
      if (error) throw error;
      setHolidays(data || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      alert("Error loading holidays");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingHoliday) {
        // Update existing
        const { error } = await supabase
          .from("company_holidays")
          .update({
            holiday_name: formData.holiday_name,
            holiday_date: formData.holiday_date,
            holiday_type: formData.holiday_type,
            is_optional: formData.is_optional,
            description: formData.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingHoliday.id);

        if (error) throw error;
        alert("✅ Holiday updated successfully");
      } else {
        // Create new
        const { error } = await supabase.from("company_holidays").insert([
          {
            holiday_name: formData.holiday_name,
            holiday_date: formData.holiday_date,
            holiday_type: formData.holiday_type,
            is_optional: formData.is_optional,
            description: formData.description,
            created_by: currentUser?.id,
          },
        ]);

        if (error) throw error;
        alert("✅ Holiday added successfully");
      }

      setShowAddModal(false);
      setEditingHoliday(null);
      setFormData({
        holiday_name: "",
        holiday_date: "",
        holiday_type: "National",
        is_optional: false,
        description: "",
      });
      fetchHolidays();
    } catch (error: any) {
      console.error("Error saving holiday:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      holiday_name: holiday.holiday_name,
      holiday_date: holiday.holiday_date,
      holiday_type: holiday.holiday_type,
      is_optional: holiday.is_optional,
      description: holiday.description || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (holidayId: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("company_holidays")
        .delete()
        .eq("id", holidayId);

      if (error) throw error;
      alert("✅ Holiday deleted successfully");
      fetchHolidays();
    } catch (error: any) {
      console.error("Error deleting holiday:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "National":
        return "bg-red-100 text-red-800";
      case "Festival":
        return "bg-purple-100 text-purple-800";
      case "Company":
        return "bg-blue-100 text-blue-800";
      case "Regional":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && holidays.length === 0) {
    return <LoadingScreen message="Loading holidays..." />;
  }

  // Group holidays by year
  const holidaysByYear = holidays.reduce(
    (acc, holiday) => {
      const year = new Date(holiday.holiday_date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(holiday);
      return acc;
    },
    {} as Record<number, Holiday[]>,
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Company Holidays
            </h1>
            <p className="text-gray-600 mt-1">
              Manage company holiday calendar
            </p>
          </div>
          <button
            onClick={() => {
              setEditingHoliday(null);
              setFormData({
                holiday_name: "",
                holiday_date: "",
                holiday_type: "National",
                is_optional: false,
                description: "",
              });
              setShowAddModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2"
          >
            <span className="text-xl">➕</span>
            Add Holiday
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200">
            <div className="text-red-600 text-2xl mb-1">🇮🇳</div>
            <div className="text-2xl font-bold text-red-900">
              {holidays.filter((h) => h.holiday_type === "National").length}
            </div>
            <div className="text-sm text-red-700">National Holidays</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-200">
            <div className="text-purple-600 text-2xl mb-1">🎉</div>
            <div className="text-2xl font-bold text-purple-900">
              {holidays.filter((h) => h.holiday_type === "Festival").length}
            </div>
            <div className="text-sm text-purple-700">Festival Holidays</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
            <div className="text-blue-600 text-2xl mb-1">🏢</div>
            <div className="text-2xl font-bold text-blue-900">
              {holidays.filter((h) => h.holiday_type === "Company").length}
            </div>
            <div className="text-sm text-blue-700">Company Holidays</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <div className="text-yellow-600 text-2xl mb-1">⭐</div>
            <div className="text-2xl font-bold text-yellow-900">
              {holidays.filter((h) => h.is_optional).length}
            </div>
            <div className="text-sm text-yellow-700">Optional Holidays</div>
          </div>
        </div>

        {/* Holidays by Year */}
        {Object.keys(holidaysByYear)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => (
            <div key={year} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{year}</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Holiday Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Optional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {holidaysByYear[Number(year)].map((holiday) => {
                      const holidayDate = new Date(holiday.holiday_date);
                      const isPast = holidayDate < new Date();

                      return (
                        <tr
                          key={holiday.id}
                          className={`hover:bg-gray-50 ${isPast ? "opacity-60" : ""}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {holidayDate.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {holidayDate.toLocaleDateString("en-IN", {
                                weekday: "short",
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {holiday.holiday_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.holiday_type)}`}
                            >
                              {holiday.holiday_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {holiday.is_optional ? (
                              <span className="text-yellow-600">
                                ⭐ Optional
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {holiday.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(holiday)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(holiday.id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {holidays.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Holidays Found
            </h3>
            <p className="text-gray-600">
              Add your first company holiday to get started
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    value={formData.holiday_name}
                    onChange={(e) =>
                      setFormData({ ...formData, holiday_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.holiday_date}
                    onChange={(e) =>
                      setFormData({ ...formData, holiday_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.holiday_type}
                    onChange={(e) =>
                      setFormData({ ...formData, holiday_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {holidayTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_optional}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_optional: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Optional Holiday
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                  >
                    {loading
                      ? "Saving..."
                      : editingHoliday
                        ? "Update Holiday"
                        : "Add Holiday"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingHoliday(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayManagementPage;
