import companyCreateApiSlice from "./packagesCreateSlice";

const packagesApi = companyCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all packages
    fetchPackages: builder.query<any, void>({
      query: () => ({
        url: "pricing-packages",
        credentials: "include",
      }),
      providesTags: ["Package"],
    }),

    // GET: Fetch a single package
    fetchSinglePackage: builder.query<any, string>({
      query: (id) => ({
        url: `pricing-packages/${id}`,
        credentials: "include",
      }),
      providesTags: ["Package"],
    }),

    // POST: Create a new package
    createPackage: builder.mutation<any, Partial<any>>({
      query: (newPackage) => ({
        url: "pricing-packages",
        method: "POST",
        body: newPackage,
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),

    // PUT: Update an existing package
    updatePackage: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `pricing-packages/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),

    // DELETE: Remove a package by id
    deletePackage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `pricing-packages/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useFetchPackagesQuery,
  useFetchSinglePackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi;

export default packagesApi;
