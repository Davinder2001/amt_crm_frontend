import userCreateApiSlice from "./userCreateSlice";

interface Role {
  id: number;
  name: string;
}

// For fetching, include the business ID field.
interface FetchUser {
  id: number;
  name: string;
  email: string;
  company_id: number;
  company_slug: string;
  roles: Role[];
}

// For creating/updating, the client does not send the business ID.
interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface UsersResponse {
  users: FetchUser[];
}

const userApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: "api/v1/users",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (newUser) => ({
        url: "api/v1/users",
        method: "POST",
        body: newUser,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `api/v1/users/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUser: builder.mutation<
      User,
      { id: number; name: string; email: string; role: string }
    >({
      query: ({ id, ...data }) => ({
        url: `api/v1/users/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;

export default userApi;
