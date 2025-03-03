// roleEndpoints.ts
import userCreateApiSlice from './rolesCreateSlice';

export const roleApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /roles endpoint to fetch roles list
    getRoles: builder.query({
      query: () => 'api/v1/roles',
      providesTags: ['Auth'],
    }),
    // Additional endpoints (create, update, delete) can be added here
    createRole: builder.mutation({
      query: (newRole) => ({
        url: 'api/v1/roles',
        method: 'POST',
        body: newRole,
      }),
      invalidatesTags: ['Auth'],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `api/v1/roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Auth'],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `api/v1/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
