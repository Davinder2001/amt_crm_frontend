import storeApiSlice from './vendorCreateSlice';
import { Vendor, VendorsResponse, CreateVendorRequest } from '@/types/StoreVendor';

const vendorApiSlice = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchVendors: builder.query<VendorsResponse, void>({
      query: () => ({
        url: 'store/vendors',
        credentials: 'include',
      }),
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
    updateVendor: builder.mutation<Vendor, { id: number; vendor_name: string }>({
      query: ({ id, ...data }) => ({
        url: `store/vendors/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const {
  useFetchVendorsQuery,
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useUpdateVendorMutation,
} = vendorApiSlice;

export default vendorApiSlice;
