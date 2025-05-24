import companyCreateSlice from "./companyCreateSlice";


// types.ts or top of your file
export interface Package {
  id: number;
  name: string;
  employee_numbers: number;
  items_number: number;
  daily_tasks_number: number;
  package_type: string;
  invoices_number: number;
  price: string;
  business_category_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  company_name: string;
  company_id: string;
  package_id: number;
  business_category: number;
  company_slug: string;
  [key: string]: any;
}

export interface CompanyDetailsResponse {
  company: Company;
  subscribed_package: Package;
  related_packages: Package[];
}


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


    orderNewCompany: builder.mutation<AddCompany, { buiness_id: string, business_category_id: number, package_id: number | null, company_name: string }>({
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
  useFetchCompanyDetailsQuery
} = companyApi;

export default companyApi;
