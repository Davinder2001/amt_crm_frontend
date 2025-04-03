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
  }),
});

export const {
  useFetchCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;

export default companyApi;
