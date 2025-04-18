import invoiceCreateApiSlice from "./invoiceCreateSlice";

export interface InvoiceItem {
  item_id: number | null;
  quantity: number;
  unit_price: number;
  description: string;
  total: number;
}



export interface CreateInvoicePayload {
  client_name: string;
  number: string;
  email?: string;
  invoice_date: string;
  items: InvoiceItem[];
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  client_email: string;
  invoice_date: string;
  total_amount: number;
  items: InvoiceItem[];
}

export interface InvoicePdfDownloadResponse {
  pdfUrl: string; // Example, update this based on actual backend response
}

const invoiceApi = invoiceCreateApiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    fetchInvoices: builder.query<Invoice[], void>({
      query: () => "invoices",
      providesTags: ["Invoice"],
    }),

    createInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices",
        method: "POST",
        body: {
          ...newInvoice,
          items: newInvoice.items
            .filter((item) => item.item_id !== null)
            .map((item) => ({
              item_id: item.item_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
        },
      }),
      invalidatesTags: ["Invoice"],
    }),

    printInvoice: builder.mutation<Blob, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices/print",
        method: "POST",
        body: {
          ...newInvoice,
          items: newInvoice.items
            .filter((item) => item.item_id !== null)
            .map((item) => ({
              item_id: item.item_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
        },
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Invoice"],
    }),

    mailInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices/mail",
        method: "POST",
        body: {
          ...newInvoice,
          items: newInvoice.items
            .filter((item) => item.item_id !== null)
            .map((item) => ({
              item_id: item.item_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
        },
      }),
      invalidatesTags: ["Invoice"],
    }),

    getInvoiceById: builder.query<Invoice, string | number>({
      query: (id) => `invoices/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),

    downloadInvoicePdf: builder.query<Blob, number>({
      query: (id) => ({
        url: `invoices/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
  useCreateInvoiceMutation,
  usePrintInvoiceMutation,
  useMailInvoiceMutation,
  useGetInvoiceByIdQuery,
  useLazyDownloadInvoicePdfQuery,
} = invoiceApi;

export default invoiceApi;
