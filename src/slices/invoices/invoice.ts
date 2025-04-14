import invoiceCreateApiSlice from "./invoiceCreateSlice";

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

    getInvoiceById: builder.query<Invoice, string | number>({
      query: (id) => `invoices/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),

    downloadInvoicePdf: builder.query<InvoicePdfDownloadResponse, number>({
      query: (id) => ({
        url: `invoices/${id}/download`,
      }),
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
  useCreateInvoiceMutation,
  useGetInvoiceByIdQuery,
  useLazyDownloadInvoicePdfQuery,
} = invoiceApi;

export default invoiceApi;
