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
  cost_price: number;
  selling_price: number;
  online_visibility: string;
  description: string;
  item_code: string;
  catalog?: number | boolean | null;
  brand_name: string;
  replacement: string | null;
  category: string | null;
  vendor_name: string | null;
  availability_stock: number;
  created_at: string;
  updated_at: string;
  images: (string | File)[];
  final_cost: number;
  categories: Category[];
  variants: variations[];
  taxes?: { name: string; rate: number }[];
}

interface Category {
  id: number;
  company_id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  items?: StoreItem[];
  [key: string]: unknown;
}

interface CategoryResponse {
  data: Category[];
}

interface CartItem {
  id: number;
  itemId?: number;
  name: string;
  quantity: number;
  final_cost: number;
  description?: string;
}

type TabType = 'Cart' | 'Delivery' | 'Pickup';


interface AttributeItem {
  attribute_id: number | string;
  attribute_value_id: number | string;
  attribute: string;
  value: string;
  final_cost: number;
}

interface AttributeOption {
  attribute: string;
  values: string[];
}

interface variations {
  id?: number;
  regular_price?: number;
  price: number;
  stock?: number;
  images?: string[];
  final_cost?: number;
  attributes: AttributeItem[];
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
  cost_price: number;
  selling_price: number;
  tax_id: number;
  images: File[],
  variants: variations[],
  categories: Category[]
}

type StoreResponse = StoreItem[];

interface OcrResponse {
  result: string;
  products?: { name: string; price: number; quantity: number; sub_total: number }[];
  message?: string;
}

interface UpdateStoreItemRequest {
  id: number;
  name?: string;
  quantity_count?: number;
  price?: number;
  quantity?: number;
  measurement?: string | null;
  purchase_date?: string | null;
  date_of_manufacture?: string;
  date_of_expiry?: string | null;
  cost_price?: number;
  selling_price?: number;
  online_visibility?: string;
  description?: string;
  item_code?: string;
  catalog?: number | null;
  brand_name?: string;
  replacement?: string | null;
  vendor_name?: string | null;
  availability_stock?: number;
  date_of_manufacture?: string;
  date_of_expiry?: string | null;
  category?: string | null;
  brand_name?: string;
  created_at?: string;
  updated_at?: string;
  images?: (string | File)[];
  categories?: Category[];
  variants?: variations[];
}


interface Vendor {
  id: number;
  company_id: number;
  vendor_name: string;
  created_at: string;
  updated_at: string;
}
type VendorsResponse = Vendor[];

interface CreateVendorRequest {
  vendor_name: string;
}

interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
};

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
  status: string;
};

interface CreateAttributePayload {
  name: string;
  values: string[];
};
