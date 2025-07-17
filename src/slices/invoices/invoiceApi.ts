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

    fetchInvoices: builder.query<InvoicesResponse, { page?: number; per_page?: number }>({
      query: (params) => ({
        url: "invoices",
        params: {
          page: params.page,
          per_page: params.per_page
        }
      }),
      providesTags: ["Invoice"],
    }),

    createInvoice: builder.mutation<{ status?: boolean, message?: string, error?: string }, FormData>({
      query: (formData) => ({
        url: "invoices",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),

    saveAndShare: builder.mutation<{
      status: boolean;
      message: string;
      invoice: Invoice;
    }, FormData>({
      query: (formData) => ({
        url: "invoices/save-share",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),

    printInvoice: builder.mutation<Blob, FormData>({
      query: (formData) => ({
        url: "invoices/print",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Invoice"],
    }),

    whatsappInvoice: builder.mutation<{ status?: boolean, message?: string, error?: string }, FormData>({
      query: (formData) => ({
        url: "invoices/store-whatsapp",
        method: "POST",
        body: formData,
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
    getOnlinePaymentHistory: builder.query<PaymentHistoryResponse<OnlinePaymentGroup>, void>({
      query: () => 'invoices/payments-history/online',
      providesTags: ['Invoice'],
    }),

    getCashPaymentHistory: builder.query<PaymentHistoryResponse<DateGroupedPayment>, void>({
      query: () => 'invoices/payments-history/cash',
      providesTags: ['Invoice'],
    }),

    getCardPaymentHistory: builder.query<PaymentHistoryResponse<DateGroupedPayment>, void>({
      query: () => 'invoices/payments-history/card',
      providesTags: ['Invoice'],
    }),

    getCreditPaymentHistory: builder.query<PaymentHistoryResponse<DateGroupedPayment>, void>({
      query: () => 'invoices/payments-history/credit',
      providesTags: ['Invoice'],
    }),

    getSelfConsumptionHistory: builder.query<PaymentHistoryResponse<DateGroupedPayment>, void>({
      query: () => 'invoices/payments-history/self-consumption',
      providesTags: ['Invoice'],
    }),

  }),
});

export const {
  useFetchInvoicesQuery,
  useCreateInvoiceMutation,
  usePrintInvoiceMutation,
  useWhatsappInvoiceMutation,
  useGetInvoiceByIdQuery,
  useLazyDownloadInvoicePdfQuery,
  useSendInvoiceToWhatsappMutation,
  useSaveAndShareMutation,
  useGetCreditUsersQuery,
  usePayCreditInvoiceMutation,
  useGetCreditInvoiceByIdQuery,
  useGetOnlinePaymentHistoryQuery,
  useGetCashPaymentHistoryQuery,
  useGetCardPaymentHistoryQuery,
  useGetCreditPaymentHistoryQuery,
  useGetSelfConsumptionHistoryQuery,
} = invoiceApi;


export default invoiceApi;
