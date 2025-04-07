import invoiceCreateApiSlice from "./invoiceCreateSlice";

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
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

export interface InvoicesResponse {
  invoices: Invoice[];
}

const invoiceApi = invoiceCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchInvoices: builder.query<InvoicesResponse, void>({
      query: () => "invoices",
      providesTags: ["Invoice"],
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
} = invoiceApi;

export default invoiceApi;
