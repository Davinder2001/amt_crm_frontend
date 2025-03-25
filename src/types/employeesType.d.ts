
interface Role {
    id: number;
    name: string;
}

interface EmployeeSalary {
    current_salary: number;
    salary_history: any[];
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
}

interface EmployeesResponse {
    employees: Employee[];
    total: number;
}
