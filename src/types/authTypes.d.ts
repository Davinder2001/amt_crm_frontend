
interface Meta {
    [key: string]: string | number | boolean | object; // Allow for flexible meta data
}

interface Company {
    id: number; // Updated to number
    admin_id: number;
    company_id: string;
    company_name: string;
    company_slug: string;
    created_at: string;
    payment_status: string;
    updated_at: string;
    verification_status: string;
    [key: string]: string | number; // Allow for additional fields
}

interface UserProfile {
    id: number;
    name: string;
    number: string;
    company_id: number;
    company_name: string;
    company_slug: string;
    meta: Meta;
    user_type: "admin" | "employee" | "user" | "superadmin"; // Union type for user_type
    password: string;
    companies: Company[]; // Updated to array of Company objects
}

interface UsersResponse {
    message: string;
    user: Profile;
}

// Response type for fetching selected company
interface SelectedCompanyResponse {
    company_user_role: "admin" | "employee" | "user" | "superadmin";
    selected_company: Profile;
}