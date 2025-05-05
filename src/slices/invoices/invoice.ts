import invoiceCreateApiSlice from "./invoiceCreateSlice";


const invoiceApi = invoiceCreateApiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({

    fetchInvoices: builder.query<InvoicesResponse, void>({
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

    getInvoiceById: builder.query<{ invoice: Invoice }, string | number>({
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
