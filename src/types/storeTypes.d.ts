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
  regular_price?: number;
  sale_price?: number;
  online_visibility: string;
  description: string;
  item_code: string;
  catalog?: number | boolean | null;
  brand_name?: string;
  brand_id?: number | null;
  replacement: string | null;
  category: string | null;
  vendor_id: number | null;
  vendor_name?: string | null;
  product_type: 'simple_product' | 'variable_product';
  availability_stock: number;
  created_at: string;
  updated_at: string;
  featured_image: string;
  images: (string | File)[] | File[];
  final_cost: number;
  categories: Category[];
  variants: variations[];
  taxes: Tax[];
  units: MeasuringUnit[];
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
  id: string | number;
  variantId?: number;
  itemId?: number;
  name: string;
  featured_image?: string;
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
  regular_price: number;
  sale_price: number;
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
  brand_name?: string;
  brand_id?: number | null;
  replacement?: string;
  category?: string;
  vendor_id: number | null;
  vendor_name?: string;
  availability_stock: number;
  cost_price: number;
  regular_price?: number;
  sale_price?: number;
  product_type: 'simple_product' | 'variable_product';
  tax_id: number;
  unit_id: number;
  featured_image: File | string | null;
  images: (string | File)[] | File[];
  variants: variations[];
  categories: TCategories;
  success?: boolean;
  message?: string;
  error?: string;
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

interface Vendors {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
}

interface Vendor {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
  items_by_date?: Array[];
  vendor_address: string;
  vendor_email: string;
  vendor_number: number | string;
  company_id: number;
  vendor_name: string;
  created_at: string;
  updated_at: string;
}
type VendorsResponse = Vendor[];


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


interface Brand {
  id: number;
  name: string;
  company_id: number;
  created_at?: string;
  updated_at?: string;
}
