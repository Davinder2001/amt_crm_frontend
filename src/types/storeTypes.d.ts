interface StoreItem {
    id: number;
    sr_no: number;
    name: string;
    quantity: number;
    price: number;
}

interface StoreResponse {
    data: StoreItem[];
}

interface CreateStoreItemRequest {
    name: string;
    quantity: number;
    price: number;
}
interface OcrResponse {
    message: string;
    imageUrl?: string;
}

export interface StoreItem {
    id: number;
    name: string;
    quantity_count: number;
    measurement: string | null;
    purchase_date: string | null;
    date_of_manufacture: string;
    date_of_expiry: string | null;
    brand_name: string;
    replacement: string | null;
    category: string | null;
    vendor_name: string | null;
    availability_stock: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateStoreItemRequest {
    name: string;
    quantity_count: number;
    measurement?: string;
    purchase_date?: string;
    date_of_manufacture: string;
    date_of_expiry?: string;
    brand_name: string;
    replacement?: string;
    category?: string;
    vendor_name?: string;
    availability_stock: number;
  }
  
  export type StoreResponse = StoreItem[];
  