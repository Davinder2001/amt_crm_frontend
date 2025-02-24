import employeCreateApiSlice from "./employeeCreateSlice";

interface Employee {
    id: number;
    name: string;
    position: string;
  }
  
  interface EmployeesResponse {
    employees: Employee[];
  }
  

const employeCreateApi = employeCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      fetchEmployes: builder.query<EmployeesResponse, void>({
        query: () => 'api/v1/users',
        providesTags: ['Employe'],
      }),
    }),
  });
  
  export const { useFetchEmployesQuery } = employeCreateApi;
  

 
export default employeCreateApi;
