import employeCreateApiSlice from "./employeeCreateSlice";


const employeApi = employeCreateApiSlice.injectEndpoints({

  endpoints: (builder) => ({

    fetchEmployes: builder.query<EmployeesResponse, void>({
      query: () => "employee",
      providesTags: ["Employee"],
    }),


    fetchEmployeById: builder.query<PaySlipResponse, number>({
      query: (id) => `employee/${id}`,
      providesTags: ["Employee"],
    }),


    createEmploye: builder.mutation<Employee, FormData | Record<string, unknown>>({
      query: (newEmploye) => ({
        url: "employee",
        method: "POST",
        body: newEmploye,
        // Do not set Content-Type; browser will set it for FormData
      }),
      invalidatesTags: ["Employee"],
    }),


    updateEmploye: builder.mutation<Employee, { id: number } & Partial<Employee>>({
      query: ({ id, ...rest }) => ({
        url: `employee/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Employee"],
    }),

    updateEmployeeStatus: builder.mutation<void, { id: string; status: "active" | "inactive" | "blocked" }>({
      query: ({ id, status }) => ({
        url: `change-emp-status/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Employee"],
    }),



    deleteEmploye: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),


    fetchPaySlipById: builder.query<PaySlipResponse, number>({
      query: (id) => `employee/salarySlip/${id}`,
      providesTags: ["Employee"],
    }),


    downloadPaySlipById: builder.query<Employee, number>({
      query: (id) => `employee/salary-slip-pdf/${id}`,
      providesTags: ["Employee"],
    }),


    fetchEmployeesSalary: builder.query<EmployeesResponse, void>({
      query: () => "employees/salary",
      providesTags: ["Employee"],
    }),

    fetchEmployeesSalaryById: builder.query<Employee, number>({
      query: (id) => `employee/${id}/salary`,
      providesTags: ["Employee"],
    }),


    downloadPaySlipPdf: builder.query<Employee, number>({
      query: (id) => `employee/downloadSlip/${id}`,
      providesTags: ["Employee"],
    }),

    generateSalary: builder.mutation<GenerateSalaryResponse, { id: number; month?: string; year?: string }>({
      query: ({ id, month, year }) => ({
        url: `employee/generate-salary/${id}`,
        method: 'POST',
        body: { month, year },
      }),
      invalidatesTags: ['Employee'],
    }),

  }),
});

export const {
  useFetchEmployesQuery,
  useFetchEmployeByIdQuery,
  useCreateEmployeMutation,
  useUpdateEmployeeStatusMutation,
  useUpdateEmployeMutation,
  useDeleteEmployeMutation,
  useFetchPaySlipByIdQuery,
  useLazyDownloadPaySlipByIdQuery,
  useFetchEmployeesSalaryQuery,
  useFetchEmployeesSalaryByIdQuery,
  useLazyDownloadPaySlipPdfQuery,
  useGenerateSalaryMutation,
} = employeApi;

export default employeApi;
