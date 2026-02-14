import React from "react";
import AddEmployeeForm from "./components/forms/AddEmployeeForm";

const AddEmployeePage: React.FC = () => {
  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="p-6">
      <AddEmployeeForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddEmployeePage;
