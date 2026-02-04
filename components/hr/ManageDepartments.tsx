
import React, { useState } from 'react';

const initialDepartments = [
  'Machining',
  'Assembly',
  'Quality Control',
  'Administration',
  'Maintenance',
  'Logistics',
];

const ManageDepartments: React.FC = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDepartment, setNewDepartment] = useState('');

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartment && !departments.includes(newDepartment)) {
      setDepartments([...departments, newDepartment]);
      setNewDepartment('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Existing Departments</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
        {departments.map(dept => (
          <li key={dept} className="p-2 bg-gray-100 rounded-md text-sm">{dept}</li>
        ))}
      </ul>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Add New Department</h3>
        <form onSubmit={handleAddDepartment} className="flex space-x-2">
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="New department name"
            className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
          />
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-accent hover:bg-brand-secondary rounded-md">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageDepartments;
