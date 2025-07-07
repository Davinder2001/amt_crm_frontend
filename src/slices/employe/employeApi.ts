import employeCreateApiSlice from "./employeeCreateSlice";


const employeApi = employeCreateApiSlice.injectEndpoints({

  endpoints: (builder) => ({

    fetchEmployes: builder.query<EmployeesResponse, void>({
      query: () => "employee",
      providesTags: ["Employe"],
    }),


    fetchEmployeById: builder.query<PaySlipResponse, number>({
      query: (id) => `employee/${id}`,
      providesTags: ["Employe"],
    }),


    createEmploye: builder.mutation<Employee, Partial<Employee>>({
      query: (newEmploye) => ({
        url: "employee",
        method: "POST",
        body: newEmploye,
      }),
      invalidatesTags: ["Employe"],
    }),


    updateEmploye: builder.mutation<Employee, { id: number } & Partial<Employee>>({
      query: ({ id, ...rest }) => ({
        url: `employee/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Employe"],
    }),

    updateEmployeeStatus: builder.mutation<void, { id: string; status: "active" | "inactive" | "blocked" }>({
      query: ({ id, status }) => ({
        url: `change-emp-status/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Employe"],
    }),



    deleteEmploye: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employe"],
    }),


    fetchPaySlipById: builder.query<PaySlipResponse, number>({
      query: (id) => `employee/salarySlip/${id}`,
      providesTags: ["Employe"],
    }),


    downloadPaySlipById: builder.query<Employee, number>({
      query: (id) => `employee/salary-slip-pdf/${id}`,
      providesTags: ["Employe"],
    }),


    fetchEmployeesSalary: builder.query<EmployeesResponse, void>({
      query: () => "employees/salary",
      providesTags: ["Employe"],
    }),

    fetchEmployeesSalaryById: builder.query<Employee, number>({
      query: (id) => `employee/${id}/salary`,
      providesTags: ["Employe"],
    }),


    downloadPaySlipPdf: builder.query<Employee, number>({
      query: (id) => `employee/downloadSlip/${id}`,
      providesTags: ["Employe"],
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
} = employeApi;

export default employeApi;
