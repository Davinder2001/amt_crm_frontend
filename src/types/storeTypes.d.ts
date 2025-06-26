interface Measurement {
  id: number;
  name: string;
}

interface storeItemBatch {
  id: number;
  item_id: number;
  batch_number: string | null;
  purchase_price: number | null;
  date_of_manufacture: string | null;
  invoice_number?: number | null;
  product_type?: 'simple_product' | 'variable_product';
  unit_of_measure: 'unit' | 'pieces';
  vendor_id: number | null;
  vendor_name?: string | null;
  units_in_peace?: number | null;
  price_per_unit?: number | null;
  measurement?: Measurement | null;
  availability_stock: number;
  cost_price: number;
  date_of_expiry: string | null;
  cost_price: number;
  vendor: Vendor;
  regular_price?: number;
  sale_price?: number;
  purchase_date: string | null;
  replacement: string | null;
  quantity: number;
  expiry_date: string | null;
  variants: variations[];
  created_at: string;
}
interface getSingleBatchResponse {
  success: boolean;
  message: string;
  batch: storeItemBatch;
}

interface StoreItem {
  tax_id: number;
  id: number;
  name: string;
  quantity_count: number;
  price: number;
  quantity: number;
  measurement: Measurement | null;
  purchase_date: string | null;
  date_of_manufacture: string;
  date_of_expiry: string | null;
  invoice_number?: number | null;
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
  unit_of_measure: 'unit' | 'pieces';
  tax_type: 'include' | 'exclude';
  units_in_peace?: number | null;
  price_per_unit?: number | null;
  availability_stock: number;
  created_at: string;
  updated_at: string;
  featured_image: string;
  images: (string | File)[] | File[];
  final_cost: number;
  categories: Category[];
  variants: variations[];
  taxes: Tax[];
  brand: Brand;
  vendor: Vendor;
  units: MeasuringUnit[];
  batches?: ItemBatch[];
}

interface Category {
  id: number;
  company_id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  invoice_items?: StoreItem[];
  [key: string]: unknown;
}

interface CategoryResponse {
  data: Category[];
}
interface CartItemVariant {
  variant_id: number;
  quantity: number;
  final_cost: number | null;
  units: number | null;
}

interface cartBaseItem {
  item_id: number;
  quantity: number;
  final_cost: number | null;
  product_type?: "simple_product" | "variable_product";
  unit_of_measure?: "unit" | "pieces";
  batch_id?: number | null;
  variant_id?: number;
  units?: number | null;
}


interface CartItem {
  id: string | number;
  variantId?: number;
  itemId?: number;
  name: string;
  featured_image?: string | null;
  quantity: number;
  final_cost: number;
  product_type?: 'simple_product' | 'variable_product';
  unit_of_measure?: 'unit' | 'pieces';
  isMaxQuantity?: boolean;
  variants?: {
    variant_id: number;
    quantity: number;
    final_cost: number | null;
    units: number | null;
  }[];
  batches?: {
    batch_id: number;
    quantity: number;
    variants?: {
      variant_id: number;
      quantity: number;
      final_cost: number | null;
      units: number | null;
    }[];
  }[];
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
  variant_regular_price: number;
  variant_sale_price: number;
  variant_stock: number;
  variant_units_in_peace?: number | null;
  variant_price_per_unit?: number | null;
  images?: string[];
  final_cost?: number;
  attributes: AttributeItem[];
  units?: number | null;
}

interface CreateStoreItemRequest {
  name: string;
  brand_name?: string;
  brand_id?: number | null;
  tax_id: number | null;
  measurement: number | null;
  featured_image: File | string | null;
  images: (string | File)[] | File[];
  categories: Category[];
}
interface UpdateStoreItemRequest {
  id: number;
  name: string;
  brand_name?: string;
  brand_id?: number | null;
  tax_id: number | null;
  measurement: number | null;
  featured_image: File | string | null;
  images: (string | File)[] | File[];
  categories: number[];
}

interface BaseStoreItemRequest<TCategories = Category[]> {
  name: string;
  quantity_count?: number | null;
  purchase_date?: string | null;
  date_of_manufacture: string | null;
  date_of_expiry?: string | null;
  invoice_number?: number | null;
  brand_name?: string | null;
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
  unit_of_measure: 'unit' | 'pieces';
  units_in_peace?: number | null;
  price_per_unit?: number | null;
  tax_id: number | null;
  tax_type: 'include' | 'exclude';
  measurement: number | null;
  featured_image: File | string | null;
  images: (string | File)[] | File[];
  variants?: variations[];
  categories: TCategories;
  success?: boolean;
  message?: string;
  error?: string;
}

interface StoreItemBatchRequest extends BaseStoreItemRequest<number[]> {
  id: number;
  batch_id?: number | null;
}

type StoreItemFormData = StoreItemBatchRequest;

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

interface AttributesResponse {
  status: boolean;
  message: string;
  data: Attribute[];
}

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

interface ItemBatch {
  id: number;
  item_id: number;
  batch_number: string | null;
  cost_price: number;
  quantity_count: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  date_of_manufacture: string | null;
  date_of_expiry: string | null;
  purchase_price: number | null;
  quantity: string;
  item?: {
    id: number;
    name: string;
    // Add other item properties as needed
  };
  variants?: variations[];
}

interface ItemBatchResponse {
  success: boolean;
  message: string;
  data?: ItemBatch | ItemBatch[];
}