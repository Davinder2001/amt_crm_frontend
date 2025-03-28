import userCreateApiSlice from './rolesCreateSlice';

export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  company_id: string;
}



export const roleApi = userCreateApiSlice.injectEndpoints({

  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => 'roles',
      providesTags: ['Auth'],
    }),

    createRole: builder.mutation({
      query: (newRole) => ({
        url: 'roles',
        method: 'POST',
        body: newRole,
      }),
      invalidatesTags: ['Auth'],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Auth'],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
