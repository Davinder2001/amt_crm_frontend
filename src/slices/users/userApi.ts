import userCreateApiSlice from "./userCreateSlice";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  users: User[];
}

const userCreateApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => 'api/v1/users',
      providesTags: ['Auth'],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/v1/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'api/v1/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useFetchUsersQuery, useLoginMutation, useLogoutMutation } = userCreateApi;

export default userCreateApi;
