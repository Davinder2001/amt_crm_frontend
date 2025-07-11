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
    file_url: string;
    data: {
        id: number;
        company_id: number;
        heading: string;
        description: string | null;
        price: number | string;
        tags: Tag[];
        status: 'pending' | 'paid';
        file_path: string | null;
        file_url: string;
    };
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
    status: 'pending' | 'paid';
}

interface ExpenseUpdateRequest {
    heading: string;
    price: number;
    tags: Tag[];
    status: 'pending' | 'paid';
    description?: string;
    invoice_ids?: number[];
    item_ids?: number[];
    user_ids?: number[];
    batch_ids?: number[];
    file?: File | null;
}

interface ExpenseFormData extends Omit<ExpenseUpdateRequest, 'price'> {
    price: string; // For form handling, we'll keep price as string
}



interface Variant {
    id: number;
    variant_regular_price: number;
    variant_sale_price: number;
    stock: number;
    variant_units_in_peace: string;
    variant_price_per_unit: number;
    attributes: Array<{
        attribute: string;
        value: string;
    }>;
}

interface Batch {
    id: number;
    cost_price: number;
    quantity: string;
    stock: string;
    product_type: string;
    purchase_date: string;
    date_of_manufacture: string;
    date_of_expiry: string;
    replacement: string;
    invoice_number: string;
    tax_type: string;
    regular_price: number;
    sale_price: number;
    unit_of_measure: string;
    units_in_peace: string | null;
    price_per_unit: number | null;
    vendor: null;
    variants: Variant[];
}

interface BatchData {
    batch: {
        purchase_date: string;
        variants: Variant[];
    };
}

interface BatchSelection {
    itemId: number;
    batchIds: number[];
}