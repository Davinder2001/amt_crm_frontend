import invoiceCreateApiSlice from "./invoiceCreateSlice";

type CreditUser = {
  customer_id: number;
  name: string;
  number: string;
  total_invoices: number;
  total_due: number;
  amount_paid: number;
  outstanding: number;
};


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

    sendInvoiceToWhatsapp: builder.mutation<
      { status: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `invoices/${id}/whatsapp`,
        method: "POST",
      }),
    }),

    getCreditUsers: builder.query<
      { status: boolean; message: string; data: CreditUser[] },
      void
    >({
      query: () => "invoices/credits/users",
      providesTags: ["Invoice"],
    }),


    payCreditInvoice: builder.mutation<
      { status: boolean; message: string },
      { id: number; amount: number, note: string }
    >({
      query: ({ id, amount, note }) => ({
        url: `invoices/credits/${id}/pay`,
        method: "POST",
        body: { amount, note },
      }),
      invalidatesTags: ["Invoice"],
    }),

    getCreditInvoiceById: builder.query<{ status: boolean; message: string }, number>({
      query: (id) => `invoices/credits/${id}`,
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
  useSendInvoiceToWhatsappMutation,
  useGetCreditUsersQuery,
  usePayCreditInvoiceMutation,
  useGetCreditInvoiceByIdQuery
} = invoiceApi;

export default invoiceApi;
