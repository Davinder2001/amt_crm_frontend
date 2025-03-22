
interface Role {
    id: number;
    name: string;
}
interface Employee {
    id: number;
    name: string;
    email: string;
    number: string;
    salary: string;
    password: string;
    profile_picture: string;
    company_id: string;
    company_name: string;
    company_slug: string;
    user_status: string;
    roles: Role[];
    meta?: {
        dateOfHire?: string;
        joiningDate?: string;
        shiftTimings?: string;
        address?: string;
        invoive?: string;
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
    dateOfHire: string;
    joiningDate: string;
    shiftTimings: string;
}

interface EmployeesResponse {
    employees: Employee[];
    total: number;
}
