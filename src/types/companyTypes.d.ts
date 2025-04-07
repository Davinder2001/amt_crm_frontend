// Define types for your Company and responses (adjust these interfaces as needed)
interface Company {
    id: string;
    name: string;
    // add additional fields here
}
interface CompaniesResponse {
    companies: Company[];
    data: Company[];
}