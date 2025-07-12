// Extend the existing EmployeeFormData interface for form usage
export interface ExtendedEmployeeFormData {
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
  profilePicture: string | File | null;
  idProofType: string;
  idProofValue: string;
  utility_bill_image: File | null;
  addressProof_image?: File | null;
}

// API response types
export interface Role {
  id: string;
  name: string;
}

export interface Shift {
  id: number;
  shift_name: string;
  start_time: string;
  end_time: string;
}

export interface RolesResponse {
  roles: Role[];
}

export interface ShiftsResponse {
  data: Shift[];
}

export interface EmployeeFormProps {
    mode?: "add" | "edit";
    employeeId?: number;
}

export interface FormSectionProps {
    formData?: ExtendedEmployeeFormData;
    errors?: { [key: string]: string };
    mode?: "add" | "edit";
    onFieldChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onDateChange?: (name: string, date: Date | null) => void;
    renderField: (
        label: string,
        name: string,
        type?: string,
        placeholder?: string,
        Icon?: React.ElementType,
        min?: number,
        max?: number
    ) => React.ReactNode;
    rolesData?: RolesResponse;
    rolesLoading?: boolean;
    rolesError?: unknown;
    shiftData?: ShiftsResponse;
    shiftLoading?: boolean;
    shiftError?: unknown;
}

export interface ImageUploadProps {
    title: string;
    fieldName: string;
    imagePreview: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
    error?: string;
    accept?: string;
    id: string;
}

export interface FormActionsProps {
    mode: "add" | "edit";
    hasChanges: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    onClearForm: () => void;
    onCancelChanges: () => void;
    showConfirm: boolean;
    setShowConfirm: (show: boolean) => void;
}

export interface FormHeaderProps {
    mode: "add" | "edit";
    allExpanded: boolean;
    onToggleAllSections: () => void;
}

export interface FormSectionHeaderProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export type RequiredLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
    children: React.ReactNode;
}; 