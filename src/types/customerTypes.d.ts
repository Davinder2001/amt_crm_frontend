interface Customer {
    customer: unknown;
    id: number;
    name: string;
    number: string;
    email?: string | null;
    company_id: number;
}

interface CustomersResponse {
    customers: Customer[];
}