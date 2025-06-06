import qutationCreateApiSlice from './quotationCreateSlice';

export interface QuotationItem {
  name: string;
  quantity: number;
  price: number;
}

// For creating new quotations (id is optional)
export type QuotationInput = Omit<Quotation, 'id'> & { id?: number };

// For fetched quotations (id is required)
export interface Quotation {
  id: number;
  customer_number: number | string;
  customer_name: string;
  customer_email?: string;
  items: QuotationItem[];
  tax_percent: number;
  sub_total: number;
  service_charges: number;
  user_id?: number;
  company_name: string;
  tax_amount: string;
  total: number;
  created_at: number;
  updated_at: number;
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

    getQuotationById: builder.query<Quotation, number>({
      query: (id) => ({
        url: `quotations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Qutation', id }],
    }),



  }),
  overrideExisting: false,
});

export const {
  useCreateQuotationMutation,
  useGetAllQuotationsQuery,
  useGenerateQuotationPdfMutation,
  useGetQuotationByIdQuery
} = quotationApi;
