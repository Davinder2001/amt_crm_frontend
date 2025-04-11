interface InvoiceItem {
  item_id: number;
  invoice_id?: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  price: number;
  total: number;
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

interface CreateInvoicePayload {
  client_name: string;
  invoice_date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    unit_price: number;
    description: string;
  }[];
}