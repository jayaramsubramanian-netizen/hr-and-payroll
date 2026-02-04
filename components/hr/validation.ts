
export const validateStep1 = (data: any) => {
    const errors: any = {};
    if (!data.fullName.trim()) errors.fullName = "Full Name is required.";
    if (!data.fatherSpouseName.trim()) errors.fatherSpouseName = "Father's/Spouse's Name is required.";
    if (!data.dob) errors.dob = "Date of Birth is required.";
    return errors;
};

export const validateStep3 = (data: any) => {
    const errors: any = {};
    if (!data.doj) errors.doj = "Date of Joining is required.";
    if (!data.designation.trim()) errors.designation = "Designation is required.";
    return errors;
};

export const validateStep4 = (data: any) => {
    const errors: any = {};
    const basicSalary = Number(data.basicSalary);
    if (!data.basicSalary || isNaN(basicSalary) || basicSalary <= 0) {
        errors.basicSalary = "Basic Salary must be a positive number.";
    }
    return errors;
};
