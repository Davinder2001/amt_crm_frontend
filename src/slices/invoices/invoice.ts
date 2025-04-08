import invoiceCreateApiSlice from "./invoiceCreateSlice";

export type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: number;
  invoice_number: string;
  client_name: string;
  invoice_date: string;
  total_amount: number;
  items: InvoiceItem[];
  pdf_base64: string;
};

export type CreateInvoicePayload = {
  client_name: string;
  invoice_date: string;
  items: {
    item_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    description?: string;
  }[];
};

const invoiceApi = invoiceCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchInvoices: builder.query<Invoice[], void>({
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
