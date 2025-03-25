import employeCreateApiSlice from "./employeeCreateSlice";

const employeCreateApi = employeCreateApiSlice.injectEndpoints({
  
  endpoints: (builder) => ({

    fetchEmployes: builder.query<EmployeesResponse, void>({
      query: () => "employee",
      providesTags: ["Employe"],
    }),


    fetchEmployeById: builder.query<Employee, number>({
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


    deleteEmploye: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employe"],
    }),


    fetchPaySlipById: builder.query<Employee, number>({
      query: (id) => `/employee/slip/view/${id}`,
      providesTags: ["Employe"],
    }),


    downloadPaySlipById: builder.query<Employee, number>({
      query: (id) => `/employee/slip/download/${id}`,
      providesTags: ["Employe"],
    }),


    fetchEmployeesSalary: builder.query<EmployeesResponse, void>({
      query: () => "employees/salary",
      providesTags: ["Employe"],
    }),

  }),
});

export const {
  useFetchEmployesQuery,
  useFetchEmployeByIdQuery,
  useCreateEmployeMutation,
  useUpdateEmployeMutation,
  useDeleteEmployeMutation,
  useFetchPaySlipByIdQuery,
  useDownloadPaySlipByIdQuery,
  useFetchEmployeesSalaryQuery,
} = employeCreateApi;

export default employeCreateApi;
