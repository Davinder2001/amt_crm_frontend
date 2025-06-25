import companyCreateApiSlice from "./packagesCreateSlice";

const packagesApi = companyCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all packages
    fetchPackages: builder.query<PackagePlan[], void>({
      query: () => ({
        url: "pricing-packages",
        credentials: "include",
      }),
      providesTags: ["Package"],
    }),

    // GET: Fetch a single package
    fetchSinglePackage: builder.query<PackagePlan, string>({
      query: (id) => ({
        url: `pricing-packages/${id}`,
        credentials: "include",
      }),
      providesTags: ["Package"],
    }),

    // POST: Create a new package
    createPackage: builder.mutation<createPackagePlan, FormData>({
      query: (formdata) => ({
        url: "pricing-packages",
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),

    // PUT: Update an existing package
    updatePackage: builder.mutation<PackagePlan, { id: number; data: PackagePlan }>({
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

    // POST: Upgrade company package
    upgradeCompanyPackage: builder.mutation<{ message: string }, { companyId: number; package_id: number; package_type: 'monthly' | 'annual' }>({
      query: ({ companyId, package_id, package_type }) => ({
        url: `companies/${companyId}/upgrade-package`,
        method: "POST",
        body: { package_id, package_type },
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
  useUpgradeCompanyPackageMutation,
} = packagesApi;

export default packagesApi;
