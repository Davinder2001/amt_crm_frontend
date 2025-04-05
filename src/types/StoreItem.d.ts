interface StoreItem {
  id: number;
  name: string;
  quantity_count: number;
  price: number;
  quantity: number;
  measurement: string | null;
  purchase_date: string | null;
  date_of_manufacture: string;
  date_of_expiry: string | null;
  description: string; // <-- Add this line
  item_code: string;
  catalog: number | null;
  brand_name: string;
  replacement: string | null;
  category: string | null;
  vendor_name: string | null;
  availability_stock: number;
  created_at: string;
  updated_at: string;
}

interface CreateStoreItemRequest {
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
  images: File[]
}

type StoreResponse = StoreItem[];

interface OcrResponse {
  result: string;
}

// In your types file (e.g., /src/types/StoreItem.ts)
interface UpdateStoreItemRequest {
  id: number;
  name: string;
  quantity_count: number;
  measurement?: string;
  purchase_date?: string;
  date_of_manufacture: string;
  date_of_expiry?: string;
  description: string;
  brand_name: string;
  replacement?: string;
  category?: string;
  vendor_name?: string;
  availability_stock: number;
}


interface AddStoreItem {
  name: string;
  quantity_count: string;
  measurement: string;
  purchase_date: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  brand_name: string;
  replacement: string;
  category: string;
  vendor_name: string;
  availability_stock: string;
  catalog: number;
  images: File[] | null; 
}