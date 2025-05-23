import qutationCreateApiSlice from './quotationCreateSlice';

export interface QuotationItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Quotation {
  customer_number: number | string;
  id?: number;
  customer_name: string;
  customer_email?: string;
  items: QuotationItem[];
  tax_percent: number;
  service_charges: number;
  user_id?: number;
}

export const quotationApi = qutationCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create Quotation
    createQuotation: builder.mutation<Quotation, Partial<Quotation>>({
      query: (newQuotation) => ({
        url: 'quotations',
        method: 'POST',
        body: newQuotation,
      }),
      invalidatesTags: ['Qutation'],
    }),

    // Add to quotationApi
    getAllQuotations: builder.query<Quotation[], void>({
      query: () => ({
        url: 'quotations',
        method: 'GET',
      }),
      providesTags: ['Qutation'],
    }),


    // Generate Quotation PDF
    generateQuotationPdf: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `quotations/${id}/pdf`,
        method: 'GET',
        responseHandler: async (response) => await response.blob(),
      }),
    }),


  }),
  overrideExisting: false,
});

export const {
  useCreateQuotationMutation,
  useGetAllQuotationsQuery,
  useGenerateQuotationPdfMutation,
} = quotationApi;
