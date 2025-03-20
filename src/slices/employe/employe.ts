import employeCreateApiSlice from "./employeeCreateSlice";

interface Role {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  number: string;
  salary: string;
  role: string;
  password: string;
  company_id: string; 
  company_name: string;
  company_slug: string;
  user_status: string;
  roles: Role[]; 
  meta?: {
    dateOfHire?: string;
    joiningDate?: string;
    shiftTimings?: string;
  };
  dateOfHire: string;
  joiningDate: string;
  shiftTimings: string;
}

interface EmployeesResponse {
  employees: Employee[];
}

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
  }),
});

export const {
  useFetchEmployesQuery,
  useFetchEmployeByIdQuery,
  useCreateEmployeMutation,
  useUpdateEmployeMutation,
  useDeleteEmployeMutation,
} = employeCreateApi;

export default employeCreateApi;
