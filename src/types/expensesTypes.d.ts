// types/expense.ts
interface Expense {
    id: number;
    company_id: number;
    heading: string;
    description: string | null;
    price: number | string;
    file_path: string | null;
    created_at: string;
    updated_at: string;
}

interface ExpenseCreateRequest {
    heading: string;
    description?: string | null;
    price: number | string;
    file: File;
}

interface ExpenseUpdateRequest {
    heading: string;
    description?: string | null;
    price: number | string;
    file?: File | null;
}