// types/expense.ts
interface Expense {
    id: number;
    company_id: number;
    heading: string;
    description: string | null;
    price: number | string;
    tags: Tag[];
    status: 'pending' | 'paid';
    file_path: string | null;
    created_at: string;
    updated_at: string;
}

interface ExpenseResponse {
    data: Expense[];
    success?: boolean
}

interface Tag {
    name: string;
}

interface ExpenseCreateRequest {
    heading: string;
    description?: string | null;
    price: number | string;
    file: File | null;
    tags: Tag[];
    status:  'pending' | 'paid';
}

interface ExpenseUpdateRequest {
    heading: string;
    description?: string | null;
    price: number | string;
    file?: File | null;
    tags: Tag[];
    status: 'pending' | 'paid';
}