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

    // createInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
    //   query: (newInvoice) => ({
    //     url: "invoices",
    //     method: "POST",
    //     body: {
    //       ...newInvoice,
    //       items: newInvoice.items
    //         .filter((item) => item.item_id !== null)
    //         .map((item) => ({
    //           item_id: item.item_id,
    //           quantity: item.quantity,
    //           final_cost: item.final_cost,
    //           variant_id: item.variant_id,
    //         })),
    //     },
    //   }),
    //   invalidatesTags: ["Invoice"],
    // }),

    // printInvoice: builder.mutation<Blob, CreateInvoicePayload>({
    //   query: (newInvoice) => ({
    //     url: "invoices/print",
    //     method: "POST",
    //     body: {
    //       ...newInvoice,
    //       items: newInvoice.items
    //         .filter((item) => item.item_id !== null)
    //         .map((item) => ({
    //           item_id: item.item_id,
    //           quantity: item.quantity,
    //           final_cost: item.final_cost,
    //           variant_id: item.variant_id,
    //         })),
    //     },
    //     responseHandler: (response) => response.blob(),
    //   }),
    //   invalidatesTags: ["Invoice"],
    // }),

    // whatsappInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
    //   query: (newInvoice) => ({
    //     url: "invoices/store-whatsapp",
    //     method: "POST",
    //     body: {
    //       ...newInvoice,
    //       items: newInvoice.items
    //         .filter((item) => item.item_id !== null)
    //         .map((item) => ({
    //           item_id: item.item_id,
    //           quantity: item.quantity,
    //           final_cost: item.final_cost,
    //           variant_id: item.variant_id,
    //         })),
    //     },
    //   }),
    //   invalidatesTags: ["Invoice"],
    // }),



    createInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices",
        method: "POST",
        body: {
          ...newInvoice,
          items: newInvoice.items
            .filter((item) => item.item_id !== null)
            .map((item) => {
              const baseItem = {
                item_id: item.item_id,
                quantity: item.quantity,
                final_cost: item.final_cost,
              };

              if (item.product_type === 'variable_product' && item.variants) {
                return {
                  ...baseItem,
                  variants: item.variants.map(variant => ({
                    variant_id: variant.variant_id,
                    quantity: variant.quantity,
                    final_cost: variant.final_cost,
                    variant_price_per_unit: variant.variant_price_per_unit,
                    units: variant.units || null
                  }))
                };
              }

              return baseItem;
            }),
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
            .map((item) => {
              const baseItem = {
                item_id: item.item_id,
                quantity: item.quantity,
                final_cost: item.final_cost,
              };

              if (item.product_type === 'variable_product' && item.variants) {
                return {
                  ...baseItem,
                  variants: item.variants.map(variant => ({
                    variant_id: variant.variant_id,
                    quantity: variant.quantity,
                    final_cost: variant.final_cost,
                    variant_price_per_unit: variant.variant_price_per_unit,
                    units: variant.units || null
                  }))
                };
              }

              return baseItem;
            }),
        },
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Invoice"],
    }),

    whatsappInvoice: builder.mutation<Invoice, CreateInvoicePayload>({
      query: (newInvoice) => ({
        url: "invoices/store-whatsapp",
        method: "POST",
        body: {
          ...newInvoice,
          items: newInvoice.items
            .filter((item) => item.item_id !== null)
            .map((item) => {
              const baseItem = {
                item_id: item.item_id,
                quantity: item.quantity,
                final_cost: item.final_cost,
              };

              if (item.product_type === 'variable_product' && item.variants) {
                return {
                  ...baseItem,
                  variants: item.variants.map(variant => ({
                    variant_id: variant.variant_id,
                    quantity: variant.quantity,
                    final_cost: variant.final_cost,
                    variant_price_per_unit: variant.variant_price_per_unit,
                    units: variant.units || null
                  }))
                };
              }

              return baseItem;
            }),
        },
      }),
      invalidatesTags: ["Invoice"],
    }),

    // getInvoiceById: builder.query<{ invoice: Invoice }, string | number>({
    //   query: (id) => `invoices/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Invoice", id }],
    // }),
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
