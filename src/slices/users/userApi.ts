import userCreateApiSlice from "./userCreateSlice";

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  role_id: string;
  password: string;
}

interface Profile {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  users: User[];
  profile: Profile[];
}

const userCreateApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => "api/v1/users",
      providesTags: ["Auth"],
    }),

    fetchProfile: builder.query<UsersResponse, void>({
      query: () => "api/v1/my-profile",
      providesTags: ["Auth"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "api/v1/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "api/v1/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (newUser) => ({
        url: "api/v1/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Auth"],
    }),    
  }),
});

export const {
  useFetchUsersQuery,
  useFetchProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useCreateUserMutation, // Hook for creating a user
} = userCreateApi;

export default userCreateApi;
