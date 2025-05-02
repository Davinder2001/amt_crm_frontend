interface InvoiceItem {
  item_id: number | null;
  invoice_id?: number;
  name: string;
  description: string;
  unit_price: number;
  price: number;
  total: number;
  quantity: number;
  measurement: string;
  date_of_manufacture: string;
  date_of_expiry: string;
}


interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  invoice_date: string;
  total_amount: string;
  pdf_path: string | null;
  pdf_base64: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
}

interface InvoicesResponse {
  invoices: Invoice[];
}
interface Variant {
  variant_id: number;
  final_cost: number;
  quantity: number;
}
interface CreateInvoicePayload {
  number: string;
  client_name: string;
  invoice_date: string;
  email?: string;
  discount_price?: number;
  percentage?: number;
  discount_type?: string;
  serviceChargeAmount?: number;
  serviceChargePercent?: number;
  serviceChargeType?: string;
  partialAmount?: number;
  creditPaymentType?: string;
  item_type: TabType;
  payment_method: string;
  address?: string;
  pincode?: string;
  delivery_charge?: number;
  items: {
    item_id: number;
    quantity: number;
    unit_price: number;
    final_cost: number;
    total: number;
  }[];
};


interface InvoicePdfDownloadResponse {
  status: boolean;
  message: string;
  pdf_base64: string;
  filename: string;
}