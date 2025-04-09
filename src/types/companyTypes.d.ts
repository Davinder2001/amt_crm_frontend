// Define types for your Company and responses (adjust these interfaces as needed)
interface Company {
    id: number;
    name: string;
    company_slug: string;
    company_name: string;
    verification_status: string;
    description?: string;
    company_id: string;
    location?: string;
}

interface CompaniesResponse {
    companies: Company[];
    data: Company[];
}