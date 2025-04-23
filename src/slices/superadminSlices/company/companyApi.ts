  import companyCreateApiSlice from "./companyCreateSlice";

  const companyApi = companyCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // GET: Fetch all companies
      fetchCompanies: builder.query<CompaniesResponse, void>({
        query: () => ({
          url: "companies",
          credentials: "include",
        }),
        providesTags: ["Company"],
      }),


      fetchSingleCompany: builder.query<Company, string>({
        query: (id) => ({
          url: `companies/${id}`,
          credentials: "include",
        }),
        providesTags: ["Company"],
      }),
      
      
      // POST: Create a new company
      createCompany: builder.mutation<Company, Partial<Company>>({
        query: (newCompany) => ({
          url: "companies",
          method: "POST",
          body: newCompany,
          credentials: "include",
        }),
        invalidatesTags: ["Company"],
      }),

      // PUT: Update an existing company
      updateCompany: builder.mutation<Company, { id: string; data: Partial<Company> }>({
        query: ({ id, data }) => ({
          url: `companies/${id}`,
          method: "PUT",
          body: data,
          credentials: "include",
        }),
        invalidatesTags: ["Company"],
      }),

      // DELETE: Remove a company by id
      deleteCompany: builder.mutation<{ message: string }, string>({
        query: (id) => ({
          url: `companies/${id}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Company"],
      }),
      
      // GET: Fetch a single company by id
      fetchCompaniesName: builder.query<void, void>({
        query: () => ({
          url: "companies/names",
          credentials: "include",
        }),
        providesTags: ["Company"],
      }),

      fetchPendingCompanies: builder.query<CompaniesResponse, void>({
        query: () => ({
          url: "companies/pending",
          credentials: "include",
        }),
        providesTags: ["Company"],
      }),

      // POST: Verify payment
      verifyCompanyPayment: builder.mutation<Company, string>({
        query: (id) => ({
          url: `companies/${id}/payment-verify`,
          method: "POST",
          credentials: "include",
        }),
        invalidatesTags: ["Company"],
      }),

      // POST: Verify status
      verifyCompanyStatus: builder.mutation<Company, string>({
        query: (id) => ({
          url: `companies/${id}/status-verify`,
          method: "POST",
          credentials: "include",
        }),
        invalidatesTags: ["Company"],
      }),



    }),
  });

  export const {
    useFetchCompaniesQuery,
    useFetchSingleCompanyQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useFetchCompaniesNameQuery,
    useFetchPendingCompaniesQuery,
    useVerifyCompanyPaymentMutation,
    useVerifyCompanyStatusMutation,
  } = companyApi;

  export default companyApi;
