interface InvoiceItem {
  id: number;
  item_id: number | null;
  invoice_id?: number;
  name: string;
  description: string;
  unit_price: number | string;
  price: number;
  total: number;
  quantity: number;
  measurement: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  tax_percentage: string;
  tax_amount: string;
  total: string;
  created_at: string;
  updated_at: string;
}

interface InvoiceCredit {
  id: number;
  customer_id: number;
  invoice_id: number;
  total_due: string;
  amount_paid: string;
  outstanding: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  credit: InvoiceCredit;
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