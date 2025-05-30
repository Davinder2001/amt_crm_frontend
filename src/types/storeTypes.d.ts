interface StoreItem {
  tax_id: number;
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
  images: (string | File)[] | File[];
  final_cost: number;
  categories: Category[];
  variants: variations[];
  taxes: Tax[];
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
  attribute_value_id: number;
  id?: number;
  regular_price?: number;
  price: number;
  stock?: number;
  images?: string[];
  final_cost?: number;
  attributes: AttributeItem[];
}

interface BaseStoreItemRequest<TCategories = Category[]> {
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
  images: (string | File)[] | File[];
  variants: variations[];
  categories: TCategories;
}


type CreateStoreItemRequest = BaseStoreItemRequest<Category[]>;
interface UpdateStoreItemRequest extends BaseStoreItemRequest<number[]> {
  id: number;
}

type StoreItemFormData = CreateStoreItemRequest | UpdateStoreItemRequest;

type StoreResponse = StoreItem[];

interface OcrResponse {
  result: string;
  products?: { name: string; price: number; quantity: number; sub_total: number }[];
  message?: string;
}

interface Vendor {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
  items_by_date?: Array[];
}
interface Vendors {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
}


interface CreateVendorRequest {
  vendor_name: string;
  vendor_number: string | number
  vendor_email: string
  vendor_address: string
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
