// Define types for your Company and responses (adjust these interfaces as needed)
interface Company {
    id: string | number;
    name: string;
    company_slug: string;
    company_name: string;
    verification_status: string;
    description?: string;
    company_id: string;
    location?: string;
    // add additional fields here
}
interface CompaniesResponse {
    companies: Company[];
    data: Company[];
}