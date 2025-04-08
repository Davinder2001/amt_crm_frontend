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
  }),
});

export const {
  useFetchInvoicesQuery,
  useCreateInvoiceMutation,
} = invoiceApi;

export default invoiceApi;
