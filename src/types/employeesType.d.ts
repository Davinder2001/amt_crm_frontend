interface Role {
  id: number;
  name: string;
}

interface EmployeeSalary {
  current_salary: number;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  number: string;
  salary: string;
  password: string;
  profilePicture: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  user_status: string;
  pdf_base64: string;
  file_name: string;
  roles: Role[];

  meta?: {
    dateOfHire?: string;
    joiningDate?: string;
    shiftTimings?: string;
    address?: string;
    invoice?: string;
    city?: string;
    nationality?: string;
    religion?: string;
    maritalStatus?: string;
    passportNumber?: string;
    emergencyContact?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    panNumber?: string;
    upiId?: string;
  };

  employee_salary: EmployeeSalary;
  dateOfHire: string;
  joiningDate: string;
  shiftTimings: string;

  // ✅ NEW (non-breaking)
  employee_details?: {
    user_id?: number;
    salary?: string;
    currentSalary?: string;
    dateOfHire?: string;
    joiningDate?: string;
    shiftTimings?: string;
    address?: string;
    nationality?: string;
    dob?: string;
    religion?: string;
    maritalStatus?: string;
    // passportNo?: string;
    emergencyContact?: string;
    emergencyContactRelation?: string;
    workLocation?: string;
    joiningType?: string;
    department?: string;
    previousEmployer?: string;
    medicalInfo?: string;
    bankName?: string;
    accountNo?: string;
    ifscCode?: string;
    panNo?: string;
    upiId?: string;
    addressProof?: string;
    profilePicture?: string;
    utility_bill_image?: string;
  };
  message?: string;
  error?: string;
}




interface PaySlipResponse {
  message: string;
  employee: Employee;
  pdf?: {
    url: string;
    filename: string;
  };
};

interface EmployeesResponse {
  employees: Employee[];
  data: Employee[];
  total: number;
}

interface EmployeeFormData {
  name: string;
  number: string;
  address: string;
  nationality: string;
  dob: string;
  religion: string;
  maritalStatus: string;
  // passportNo: string;
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
  profilePicture: string;
}
