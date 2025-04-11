interface StoreItem {
  id: number;
  name: string;
  quantity_count: number;
  price: number;
  quantity: number;
  selling_price: number;
  measurement: string | null;
  purchase_date: string | null;
  date_of_manufacture: string;
  date_of_expiry: string | null;
  cost_price: number;
  selling_price: number;
  online_visibility: string;
  description: string;
  item_code: string;
  catalog: number | null;
  brand_name: string;
  replacement: string | null;
  category: string | null;
  vendor_name: string | null;
  availability_stock: number;
  created_at: string;
  updated_at: string;
  images: File[]
}

interface attributes {
  attribute_id: number | string;
  attribute_value_id: number | string;
}

interface variations {
  [key: string]: any;
  price: number;
  attributes: attributes[];
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
  images: File[],
  variants: variations[]
}

type StoreResponse = StoreItem[];

interface OcrResponse {
  result: string;
  products?: { name: string; price: number; quantity: number; sub_total: number }[];
  message?: string;
}

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
