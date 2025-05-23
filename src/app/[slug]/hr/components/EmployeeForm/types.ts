export interface EmployeeFormData {
    name: string;
    number: string;
    address: string;
    nationality: string;
    dob: string;
    religion: string;
    maritalStatus: string;
    emergencyContact: string;
    emergencyContactRelation: string;
    email: string;
    password: string;
    salary: string;
    role: string;
    department: string;
    currentSalary: string;
    shiftTimings: string;
    dateOfHire: string;
    workLocation: string;
    joiningDate: string;
    joiningType: string;
    previousEmployer: string;
    medicalInfo: string;
    bankName: string;
    accountNo: string;
    ifscCode: string;
    panNo: string;
    upiId: string;
    addressProof: string;
    idProofType: string;
    idProofValue: string;
    utility_bill_image: File | null;
    profilePicture: File | null;
}

export interface FormStepProps {
    formData: EmployeeFormData;
    errors: Record<string, string>;
    mode: 'add' | 'edit';
    onChange: (data: EmployeeFormData) => void;
    onValidate: (errors: Record<string, string>) => void;
}