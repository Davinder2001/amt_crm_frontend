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
        url: `shifts/${id}`, // now id is extracted from payload
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // In companyApi (you likely missed this endpoint)
    deleteShift: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `shifts/${id}`,
        method: "DELETE",
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

    createTax: builder.mutation<{ status?: boolean, error?: string, message?: string; data: Tax }, CreateTaxPayload>({
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
        url: `taxes/${id}`,
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

    fetchMeasuringUnits: builder.query<MeasuringUnitResponse, void>({
      query: () => ({
        url: "store/measuring-units",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    createMeasuringUnit: builder.mutation<{ status?: boolean, error?: string, message?: string; unit: MeasuringUnit; }, { name: string }>({
      query: (payload) => ({
        url: "store/measuring-units",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    orderNewCompany: builder.mutation<{
      success: boolean;
      message: string;
      payment: {
        success: boolean;
        merchantOrderId: string;
        redirect_url: string;
      };
      company: string;
    }, FormData>({
      query: (formData) => ({
        url: "add-new-company/pay",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    addNewCompany: builder.mutation<AddCompany, string>({
      query: (orderId) => ({
        url: `add-new-company/${orderId}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Company'],
    }),

    fetchCompanyDetails: builder.query<CompanyDetailsResponse, void>({
      query: () => ({
        url: "company-details",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    updateCompany: builder.mutation<{ status: boolean; message: string; error: string }, { id: number, formdata: FormData }>({
      query: ({ id, formdata }) => ({
        url: `company-details/${id}`,
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    companyStatusDetails: builder.query<CompanyStatusResponse, number>({
      query: (id) => ({
        url: `company-status/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    companyScore: builder.query<CompanyScoreResponse, void>({
      query: () => ({
        url: 'companies/profile-score',
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


    fetchLeaves: builder.query<LeaveListResponse, void>({
      query: () => ({
        url: "company/leaves",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    createLeave: builder.mutation<LeaveResponse, CreateLeavePayload>({
      query: (payload) => ({
        url: "company/leaves",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    updateLeave: builder.mutation<LeaveResponse, UpdateLeavePayload>({
      query: ({ id, ...body }) => ({
        url: `company/leaves/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    deleteLeave: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `company/leaves/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),


    // HOLIDAYS
    fetchHolidays: builder.query<HolidayListResponse, void>({
      query: () => ({
        url: 'company/holidays',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Company'],
    }),

    createHoliday: builder.mutation<HolidayResponse, CreateHolidayPayload>({
      query: (payload) => ({
        url: 'company/holidays',
        method: 'POST',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: ['Company'],
    }),

    updateHoliday: builder.mutation<HolidayResponse, UpdateHolidayPayload>({
      query: ({ id, ...body }) => ({
        url: `company/holidays/${id}`,
        method: 'PUT',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Company'],
    }),

    deleteHoliday: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `company/holidays/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Company'],
    }),
    deleteHolidaysBulk: builder.mutation<{ message: string }, { type: 'weekly' | 'monthly' | 'general' }>({
      query: (payload) => ({
        url: `company/holidays/bulk-delete`,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Company'],
    }),

  }),
});

export const {
  useFetchCompanyShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useFetchTaxesQuery,
  useCreateTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
  useFetchMeasuringUnitsQuery,
  useCreateMeasuringUnitMutation,
  useOrderNewCompanyMutation,
  useAddNewCompanyMutation,
  useFetchCompanyDetailsQuery,
  useUpdateCompanyMutation,
  useCompanyStatusDetailsQuery,
  useCompanyScoreQuery,

  // 🔽 New bank account endpoints
  useFetchCompanyAccountsQuery,
  useAddCompanyAccountsMutation,
  useFetchSingleCompanyAccountQuery,
  useUpdateCompanyAccountMutation,
  useDeleteCompanyAccountMutation,

  // 🔽 New LEAVE hooks
  useFetchLeavesQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,

  // 🔽 New holiday hooks
  useFetchHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useDeleteHolidaysBulkMutation
} = companyApi;

export default companyApi;
