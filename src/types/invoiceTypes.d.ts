interface InvoiceItem {
  tax_rate: ReactNode;
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
  customer: Customer;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  [x: string]: ReactNode;
  client_phone: string;
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
  delivery_address: string;
  delivery_pincodes: string;
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
  id?: number | string;
  number: string;
  client_name: string;
  invoice_date: string;
  email?: string;
  discount_price?: number;
  discount_percentage?: number;
  discount_type?: string;
  serviceChargeAmount?: number;
  serviceChargePercent?: number;
  serviceChargeType?: string;
  partialAmount?: number;
  bank_account_id?: number;
  creditPaymentType?: string;
  credit_note?: string;
  item_type: TabType;
  payment_method: string;
  address?: string;
  pincode?: string;
  delivery_charge?: number;
  items: {
    item_id: number;
    quantity: number;
    final_cost: number | null;
    product_type?: 'simple_product' | 'variable_product';
    batches?: {
      batch_id: number;
      quantity: number;
      variants?: CartItemVariant[];
    }[];
  }[];
};


interface InvoicePdfDownloadResponse {
  status: boolean;
  message: string;
  pdf_base64: string;
  filename: string;
}










// historyTypes.d.ts
type Transaction = {
  id: number;
  invoice_number: string;
  invoice_date?: string; // only for online
  amount: number;
};

type OnlinePaymentGroup = {
  bank_account_id: number | null;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  total_transferred: number;
  transactions: Transaction[];
};

type DateGroupedPayment = {
  date: string;
  total: number;
  transactions: Omit<Transaction, 'invoice_date'>[];
};

type PaymentHistoryResponse<T> = {
  status: boolean;
  payment_method?: string;
  data: T[];
};
