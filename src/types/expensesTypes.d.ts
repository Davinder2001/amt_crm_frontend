// types/expense.ts
interface Expense {
    id: number;
    company_id: number;
    heading: string;
    description: string | null;
    price: number;
    file_path: string | null;
    created_at: string;
    updated_at: string;
}

interface ExpenseCreateRequest {
    heading: string;
    description?: string | null;
    price: number;
    file: File;
}

interface ExpenseUpdateRequest {
    heading: string;
    description?: string | null;
    price: number;
    file?: File | null;
}