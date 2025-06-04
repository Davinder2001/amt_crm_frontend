import companyCreateSlice from "./companyCreateSlice";


const companyApi = companyCreateSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCompanyShifts: builder.query<ShiftApiResponse, void>({
      query: () => ({
        url: "shifts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    createShift: builder.mutation<{ message: string; data: Shift }, CreateShiftPayload>({
      query: (payload) => ({
        url: "shifts",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    updateShift: builder.mutation<{ message: string; data: Shift }, UpdateShiftPayload>({
      query: ({ id, ...body }) => ({
        url: `shifts/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    fetchTaxes: builder.query<TaxesResponse, void>({
      query: () => ({
        url: "taxes",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    createTax: builder.mutation<{ message: string; data: Tax }, CreateTaxPayload>({
      query: (payload) => ({
        url: "taxes",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    updateTax: builder.mutation<{ message: string; data: Tax }, UpdateTaxPayload>({
      query: ({ id, ...body }) => ({
        url: `shifts/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),
    deleteTax: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `taxes/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),


    orderNewCompany: builder.mutation<{ redirect_url: string, orderId: string, formdata: FormData }, FormData>({
      query: (formData) => ({
        url: "add-new-company/pay",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),


    addNewCompany: builder.mutation<AddCompany, { orderId: string, formdata: FormData }>({
      query: ({ orderId, formdata }) => ({
        url: `add-new-company/${orderId}`,
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    fetchCompanyDetails: builder.query<CompanyDetailsResponse, void>({
      query: () => ({
        url: "company-details",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    // 🔽 Fetch all company bank accounts
    fetchCompanyAccounts: builder.query<FetchCompanyAccountsResponse, void>({
      query: () => ({
        url: "company/accounts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    // 🔽 Add new bank accounts (bulk)
    addCompanyAccounts: builder.mutation<AddCompanyAccountsPayload, FormData>({
      query: (payload) => ({
        url: "company/account",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // 🔽 Get a single bank account by ID
    fetchSingleCompanyAccount: builder.query<SingleCompanyAccountResponse, number>({
      query: (id) => ({
        url: `company/account/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    // 🔽 Update a specific account by ID
    updateCompanyAccount: builder.mutation<{ message: string; account: BankAccount }, UpdateCompanyAccountPayload>({
      query: ({ id, ...body }) => ({
        url: `company/account/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // 🔽 Delete a bank account by ID
    deleteCompanyAccount: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `company/account/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

  }),
});

export const {
  useFetchCompanyShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useFetchTaxesQuery,
  useCreateTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
  useOrderNewCompanyMutation,
  useAddNewCompanyMutation,
  useFetchCompanyDetailsQuery,

  // 🔽 New bank account endpoints
  useFetchCompanyAccountsQuery,
  useAddCompanyAccountsMutation,
  useFetchSingleCompanyAccountQuery,
  useUpdateCompanyAccountMutation,
  useDeleteCompanyAccountMutation,
} = companyApi;

export default companyApi;
