interface Customer {
    invoices: Invoice[];
    customer: unknown;
    id: number;
    name: string;
    number: string;
    email?: string | null;
    company_id: number;
    address: string;
    pincode: number;
}

interface CustomersResponse {
    customers: Customer[];

}