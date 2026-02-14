import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2ContactFamily from "./steps/Step2ContactFamily";
import Step3JobInfo from "./steps/Step3JobInfo";
import Step4PayrollContractor from "./steps/Step4PayrollContractor";
import Step5EmergencyContact from "./steps/Step5EmergencyContact";
import Step6Review from "./steps/Step6Review";

export interface FormData {
  fullName: string;
  dob: string;
  sex: string;
  nationality: string;
  religion: string;
  address: string;
  phone: string;
  mobile: string;
  personalEmail: string;
  maritalStatus: string;
  spouseName: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  educationalQualification: string;
  department: string;
  subDepartment?: string;
  designation: string;
  role: string;
  dateOfJoining: string;
  isContracted: boolean;
  contractorName: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorMobile: string;
  contractorEmail: string;
  bankName: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  panNumber: string;
  esiNumber: string;
  aadhaarNumber: string;
  pfNumber: string;
  bloodGroup: string;
  primaryContactName: string;
  primaryContactAddress: string;
  primaryContactPhone: string;
  primaryContactMobile: string;
  primaryContactRelationship: string;
  secondaryContactName: string;
  secondaryContactAddress: string;
  secondaryContactPhone: string;
  secondaryContactMobile: string;
  secondaryContactRelationship: string;
  employeeId: string;
}

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    sex: "Male",
    nationality: "Indian",
    religion: "",
    address: "",
    phone: "",
    mobile: "",
    personalEmail: "",
    maritalStatus: "Single",
    spouseName: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    educationalQualification: "",
    department: "Machining",
    subDepartment: "",
    designation: "",
    role: "employee",
    dateOfJoining: "",
    isContracted: false,
    contractorName: "",
    contractorAddress: "",
    contractorPhone: "",
    contractorMobile: "",
    contractorEmail: "",
    bankName: "",
    accountName: "",
    accountType: "Savings",
    accountNumber: "",
    routingNumber: "",
    panNumber: "",
    esiNumber: "",
    aadhaarNumber: "",
    pfNumber: "",
    bloodGroup: "O+",
    primaryContactName: "",
    primaryContactAddress: "",
    primaryContactPhone: "",
    primaryContactMobile: "",
    primaryContactRelationship: "",
    secondaryContactName: "",
    secondaryContactAddress: "",
    secondaryContactPhone: "",
    secondaryContactMobile: "",
    secondaryContactRelationship: "",
    employeeId: "",
  });

  // ADD THESE NEW LINES:
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);

  const saveDraft = useCallback(
    (isAutoSave = false) => {
      try {
        const draft = {
          formData,
          currentStep,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "employee_onboarding_draft",
          JSON.stringify(draft),
        );
        setLastSaved(new Date());

        if (!isAutoSave) {
          alert("✅ Draft saved successfully! You can resume this form later.");
        } else {
          setAutoSaving(true);
          setTimeout(() => setAutoSaving(false), 2000);
        }
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    },
    [formData, currentStep],
  );

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep > 1 && currentStep < 6) {
        saveDraft(true); // true = auto-save
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [currentStep, saveDraft]);

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("employee_onboarding_draft");
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        const savedDate = new Date(draft.savedAt);

        if (
          confirm(
            `Found a draft saved on ${savedDate.toLocaleString()}.\n\nDo you want to resume this draft?`,
          )
        ) {
          setFormData(draft.formData);
          setCurrentStep(draft.currentStep);
          setLastSaved(savedDate);
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem("employee_onboarding_draft");
      setLastSaved(null);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };
  useEffect(() => {
    generateEmployeeId();
  }, []);

  const generateEmployeeId = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .like("id", "EMP%")
        .order("id", { ascending: false })
        .limit(1);

      if (error) throw error;

      let newNumber = 9;
      if (data && data.length > 0) {
        const lastId = data[0].id;
        const lastNumber = parseInt(lastId.replace("EMP", ""));
        newNumber = lastNumber + 1;
      }

      const newId = `EMP${String(newNumber).padStart(3, "0")}`;
      setFormData((prev) => ({ ...prev, employeeId: newId }));
    } catch (error) {
      console.error("Error generating ID:", error);
      const newId = `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      setFormData((prev) => ({ ...prev, employeeId: newId }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.dob) {
          alert("Please fill in Name and Date of Birth");
          return false;
        }
        break;
      case 3:
        if (!formData.designation || !formData.dateOfJoining) {
          alert("Please fill in Designation and Date of Joining");
          return false;
        }
        break;
      case 4:
        if (
          !formData.isContracted &&
          (!formData.panNumber || !formData.aadhaarNumber)
        ) {
          alert("Please fill in PAN and Aadhaar numbers");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("onboarding_requests")
        .insert({
          id: formData.employeeId,
          full_name: formData.fullName,
          department: formData.department,
          sub_department: formData.subDepartment || null,
          designation: formData.designation,
          role: formData.role,
          status: "Pending",
          manager_id: getManagerForDepartment(formData.department),
          form_data: formData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      clearDraft(); // Clear draft after successful submission

      alert(
        `✅ Onboarding request submitted successfully!\n\nEmployee: ${formData.fullName}\nID: ${formData.employeeId}\nStatus: Pending Approval\n\nThe manager will review this request shortly.`,
      );
      onSuccess();
    } catch (error: unknown) {
      console.error("Error:", error);
      alert(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  // Helper function to assign manager based on department
  function getManagerForDepartment(department: string): string {
    const managerMap: Record<string, string> = {
      Machining: "MAN001",
      Assembly: "MAN002",
      "Quality Control": "MAN001",
      Administration: "HR001",
      Corporate: "CEO001",
    };
    return managerMap[department] || "MAN001";
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo formData={formData} handleChange={handleChange} />
        );
      case 2:
        return (
          <Step2ContactFamily formData={formData} handleChange={handleChange} />
        );
      case 3:
        return <Step3JobInfo formData={formData} handleChange={handleChange} />;
      case 4:
        return (
          <Step4PayrollContractor
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 5:
        return (
          <Step5EmergencyContact
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 6:
        return <Step6Review formData={formData} />;
      default:
        return null;
    }
  };

  const stepTitles = [
    "Personal Information",
    "Contact & Family",
    "Job Information",
    "Payroll / Contractor",
    "Emergency Contact",
    "Review & Submit",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ color: "#06038D" }}
              >
                Step {currentStep} of {totalSteps}
              </span>
              {autoSaving && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <span className="animate-pulse">💾</span> Auto-saving...
                </span>
              )}
              {lastSaved && !autoSaving && (
                <span className="text-xs text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: "#AB2328",
              }}
            />
          </div>
        </div>

        {/* Draft Info Banner */}
        {lastSaved && currentStep < totalSteps && (
          <div
            className="mb-4 p-4 bg-blue-50 border-l-4 rounded flex justify-between items-center"
            style={{ borderLeftColor: "#06038D" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">💾</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Draft Available
                </p>
                <p className="text-xs text-gray-600">
                  Last saved: {lastSaved.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to clear this draft? This cannot be undone.",
                  )
                ) {
                  clearDraft();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-all"
            >
              Clear Draft
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="min-h-[400px]">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  ← Previous
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={() => saveDraft(false)}
                  className="px-6 py-2 border-2 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                  style={{ borderColor: "#06038D", color: "#06038D" }}
                >
                  <span>💾</span>
                  Save Draft
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#AB2328" }}
                >
                  Next →
                </button>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: "#06038D" }}
                >
                  {saving ? "Submitting..." : "✓ Submit Employee Record"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEmployeeForm;
