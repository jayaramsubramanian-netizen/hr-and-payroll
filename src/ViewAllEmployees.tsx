import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoadingScreen from "./components/LoadingScreen";

interface Employee {
  id: string;
  name: string;
  department: string;
  sub_department?: string;
  role: string;
  employment_status: string;
  personal_email: string;
  mobile_number: string;
  date_of_joining: string;
  designation: string;
}

const ViewAllEmployees: React.FC = () => {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    subDepartment: "",
    role: "",
    employmentStatus: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [currentUser]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      let query = supabase.from("users").select("*").order("name");

      // If manager, filter by department
      if (currentUser?.role === "Manager") {
        query = query.eq("department", currentUser.department);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      emp.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      (emp.personal_email &&
        emp.personal_email
          .toLowerCase()
          .includes(filters.search.toLowerCase()));

    const matchesDepartment =
      !filters.department || emp.department === filters.department;
    const matchesSubDepartment =
      !filters.subDepartment || emp.sub_department === filters.subDepartment;
    const matchesRole = !filters.role || emp.role === filters.role;
    const matchesStatus =
      !filters.employmentStatus ||
      emp.employment_status === filters.employmentStatus;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesSubDepartment &&
      matchesRole &&
      matchesStatus
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      case "Resigned":
        return "bg-gray-100 text-gray-800";
      case "Terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Management":
        return "bg-purple-100 text-purple-800";
      case "HR/Payroll":
        return "bg-blue-100 text-blue-800";
      case "Manager":
        return "bg-indigo-100 text-indigo-800";
      case "Employee":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      department: "",
      subDepartment: "",
      role: "",
      employmentStatus: "",
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading employees..." />;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Directory
          </h1>
          <p className="text-gray-600 mt-2">
            {currentUser?.role === "Manager"
              ? `Viewing employees in ${currentUser.department} department`
              : "View and manage all employees"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {employees.length}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {
                    employees.filter((e) => e.employment_status === "Active")
                      .length
                  }
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {new Set(employees.map((e) => e.department)).size}
                </p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {filteredEmployees.length}
                </p>
              </div>
              <div className="text-4xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Name, ID, or Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    department: e.target.value,
                    subDepartment: "",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                <option value="Corporate">Corporate</option>
                <option value="HR & Admin">HR & Admin</option>
                <option value="Engineering">Engineering</option>
                <option value="Purchasing">Purchasing</option>
                <option value="Production">Production</option>
                <option value="Quality Assurance and Control">
                  Quality Assurance and Control
                </option>
                <option value="Sales">Sales</option>
                <option value="Shipping and Receiving">
                  Shipping and Receiving
                </option>
              </select>
            </div>

            {/* Sub-Department (conditional for Production) */}
            {filters.department === "Production" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Department
                </label>
                <select
                  value={filters.subDepartment}
                  onChange={(e) =>
                    setFilters({ ...filters, subDepartment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sub-Departments</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Machining">Machining</option>
                  <option value="Welding">Welding</option>
                  <option value="Assembly">Assembly</option>
                </select>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="Management">Management</option>
                <option value="HR/Payroll">HR/Payroll</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.employmentStatus}
                onChange={(e) =>
                  setFilters({ ...filters, employmentStatus: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub-Dept
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm mt-2">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {employee.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.personal_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.sub_department || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.designation || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}
                        >
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.employment_status)}`}
                        >
                          {employee.employment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetails(employee)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Details Modal */}
        {/* View Details - Navigate to Profile */}
        {showDetails && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {selectedEmployee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEmployee.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedEmployee.designation} • {selectedEmployee.department}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log("View Full Profile clicked for employee:", selectedEmployee?.id);
                    setShowDetails(false);
                    const event = new CustomEvent("navigate", {
                      detail: {
                        page: "employee-profile",
                        employeeId: selectedEmployee?.id,
                      },
                    });
                    console.log("Dispatching navigate event:", event.detail);
                    window.dispatchEvent(event);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                >
                  👤 View Full Profile
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllEmployees;
