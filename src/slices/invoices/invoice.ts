import invoiceCreateApiSlice from "./invoiceCreateSlice";

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  price: number;
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

export interface CreateInvoicePayload {
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

const invoiceApi = invoiceCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchInvoices: builder.query<InvoicesResponse, void>({
      query: () => "invoices",
      providesTags: ["Invoice"],
    }),

    createInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices",
        method: "POST",
        body: newInvoice,
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
  useCreateInvoiceMutation,
} = invoiceApi;

export default invoiceApi;
