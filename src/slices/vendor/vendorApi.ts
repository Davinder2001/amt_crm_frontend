import storeApiSlice from './vendorCreateSlice';

const vendorApiSlice = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchVendors: builder.query<Vendor, void>({
      query: () => ({
        url: 'store/vendors',
        credentials: 'include',
      }),
            transformResponse: (response: { vendor: Vendor }) => response.vendor,

      providesTags: ['Vendor'],
    }),

    fetchVendorById: builder.query<Vendor, number>({
      query: (id) => ({
        url: `store/vendors/${id}`,
        credentials: 'include',
      }),
      transformResponse: (response: { vendor: Vendor }) => response.vendor,
      providesTags: ['Vendor'],
    }),

    createVendor: builder.mutation<Vendor, CreateVendorRequest>({
      query: (newVendor) => ({
        url: 'store/vendors',
        method: 'POST',
        body: newVendor,
        credentials: 'include',
      }),
      invalidatesTags: ['Vendor'],
    }),
    deleteVendor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `store/vendors/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Vendor'],
    }),
    updateVendor: builder.mutation<Vendor, { id: number, formdata: FormData }>({
      query: ({ id, formdata }) => ({
        url: `store/vendors/${id}`,
        method: 'POST',
        body: formdata,
        credentials: 'include',
      }),
      invalidatesTags: ['Vendor'],
    }),

  }),
});

export const {
  useFetchVendorsQuery,
  useFetchVendorByIdQuery,
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useUpdateVendorMutation,
} = vendorApiSlice;

export default vendorApiSlice;
