export const LOCAL_STORAGE_KEY = "addEmpForm";

// Using the existing EmployeeFormData interface from src/types/employeesType.d.ts
const getDefaultEmployeeForm = () => ({
    name: "",
    number: "",
    address: "",
    nationality: "",
    dob: "",
    religion: "",
    maritalStatus: "",
    emergencyContact: "",
    emergencyContactRelation: "",
    email: "",
    password: "",
    salary: "",
    role: "",
    department: "",
    currentSalary: "",
    shiftTimings: "",
    dateOfHire: "",
    workLocation: "",
    joiningDate: "",
    joiningType: "",
    previousEmployer: "",
    medicalInfo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
    upiId: "",
    addressProof: "",
    profilePicture: "",
    idProofType: "",
    idProofValue: "",
    utility_bill_image: null as File | null,
    addressProof_image: null as File | null,
});

export { getDefaultEmployeeForm };

export const getChangedFields = <T extends Record<string, unknown>>(original: T, current: T): Partial<T> => {
    const changes: Partial<T> = {};
    (Object.keys(current) as Array<keyof T>).forEach(key => {
        if (original[key] !== current[key]) {
            changes[key] = current[key];
        }
    });
    return changes;
};

export const validateField = (name: string, value: string | File | null, mode: "add" | "edit", idProofType?: string): string => {
    switch (name) {
        case 'name':
            if (mode === 'add' && !value) return 'Name is required';
            if (typeof value === 'string' && value.length < 3) return 'Name must be at least 3 characters';
            break;

        case 'number':
            if (mode === 'add' && !value) return 'Phone number is required';
            if (typeof value === 'string' && !/^\d{10}$/.test(value))
                return 'Phone number must be 10 digits';
            break;

        case 'email':
            if (mode === 'add' && !value) return 'Email is required';
            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return 'Invalid email format';
            break;

        case 'password':
            if (mode === 'add' && !value) return 'Password is required';
            if (typeof value === 'string' && value.length < 8)
                return 'Password must be at least 8 characters';
            break;

        case 'dob':
            if (mode === 'add' && !value) return 'Date of birth is required';
            if (typeof value === 'string') {
                const dobDate = new Date(value);
                const age = new Date().getFullYear() - dobDate.getFullYear();
                if (age < 18) return 'Employee must be at least 18 years old';
            }
            break;

        case 'emergencyContact':
            if (mode === 'add' && !value) return 'Emergency contact is required';
            if (typeof value === 'string' && !/^\d{10}$/.test(value))
                return 'Emergency contact must be 10 digits';
            break;

        case 'idProofValue':
            if (mode === 'add' && idProofType && idProofType !== 'bill' && !value)
                return `${idProofType.charAt(0).toUpperCase() + idProofType.slice(1)} number is required`;
            if (idProofType === 'aadhar' && typeof value === 'string' && !/^\d{12}$/.test(value))
                return 'Aadhar must be 12 digits';
            if (idProofType === 'pan' && typeof value === 'string' && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value))
                return 'Invalid PAN format (e.g., ABCDE1234F)';
            break;

        case 'utility_bill_image':
            if (mode === 'add' && idProofType === 'bill' && !value)
                return 'Utility bill image is required';
            break;

        case 'salary':
        case 'currentSalary':
            if (mode === 'add' && !value) return 'Salary is required';
            if (typeof value === 'string' && !/^\d+$/.test(value))
                return 'Salary must be a number';
            break;

        case 'accountNo':
            if (mode === 'add' && !value) return 'Account number is required';
            if (typeof value === 'string' && !/^\d{9,18}$/.test(value))
                return 'Account number must be 9-18 digits';
            break;

        case 'ifscCode':
            if (mode === 'add' && !value) return 'IFSC code is required';
            if (typeof value === 'string' && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
                return 'Invalid IFSC format (e.g., ABCD0123456)';
            break;

        case 'panNo':
            if (mode === 'add' && !value) return 'PAN number is required';
            if (typeof value === 'string' && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value))
                return 'Invalid PAN format (e.g., ABCDE1234F)';
            break;

        case 'upiId':
            if (mode === 'add' && !value) return 'UPI ID is required';
            if (typeof value === 'string' && !/^[\w.-]+@[\w]+$/.test(value))
                return 'Invalid UPI ID format (e.g., name@upi)';
            break;

        default:
            if (mode === 'add' && typeof value === 'string' && !value && name !== 'password')
                return 'This field is required';
    }

    return '';
}; 