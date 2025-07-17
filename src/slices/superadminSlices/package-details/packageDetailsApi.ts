import packageDetailsCreateApiSlice from "./packageDetailsCreateSlice";

const packageDetailsApi = packageDetailsCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all package details
    fetchPackageDetails: builder.query<PackageDetailsArray, void>({
      query: () => ({
        url: "package-details",
        credentials: "include",
      }),
      providesTags: ["PackageDetail"],
    }),

    // GET: Fetch a single package detail
    fetchSinglePackageDetail: builder.query<PackageDetail, string>({
      query: (id) => ({
        url: `package-details/${id}`,
        credentials: "include",
      }),
      providesTags: ["PackageDetail"],
    }),

    // POST: Create a new package detail
    createPackageDetail: builder.mutation<{ success?: boolean, message?: string, error?: string }, CreatePackageDetailRequest>({
      query: (data) => ({
        url: "package-details",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["PackageDetail"],
    }),

    // PUT: Update an existing package detail
    updatePackageDetail: builder.mutation<PackageDetail, UpdatePackageDetailRequest>({
      query: ({ id, ...data }) => ({
        url: `package-details/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["PackageDetail"],
    }),

    // DELETE: Remove a package detail by id
    deletePackageDetail: builder.mutation<DeletePackageDetailResponse, string>({
      query: (id) => ({
        url: `package-details/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["PackageDetail"],
    }),
  }),
});

export const {
  useFetchPackageDetailsQuery,
  useFetchSinglePackageDetailQuery,
  useCreatePackageDetailMutation,
  useUpdatePackageDetailMutation,
  useDeletePackageDetailMutation,
} = packageDetailsApi;

export default packageDetailsApi; 