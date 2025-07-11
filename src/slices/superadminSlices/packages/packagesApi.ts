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
    createPackage: builder.mutation<{ success?: boolean, message?: string, error?: string }, FormData>({
      query: (formdata) => ({
        url: "pricing-packages",
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),

    // PUT: Update an existing package
    updatePackage: builder.mutation<PackagePlan, { id: number; formData: PackagePlan }>({
      query: ({ id, formData }) => ({
        url: `pricing-packages/${id}`,
        method: "PUT",
        body: formData,
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
    upgradeCompanyPackage: builder.mutation<{ redirect_url: string, orderId: string, formdata: FormData }, FormData>({
      query: (formData) => ({
        url: `payments/upgrade-package`,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Package"],
    }),

    confirmUpgradeCompanyPackage: builder.mutation<PackagePlan, { orderId: string, formdata: FormData }>({
      query: ({ orderId, formdata }) => ({
        url: `payments/confirm-upgrade-package/${orderId}`,
        method: "POST",
        body: formdata,
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
  useConfirmUpgradeCompanyPackageMutation,
} = packagesApi;

export default packagesApi;
