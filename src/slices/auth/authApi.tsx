import userCreateApiSlice from "./authCreateSlice";

interface Profile {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  profile: Profile[];
}

const authApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProfile: builder.query<UsersResponse, void>({
      query: () => ({
        url: "api/v1/my-profile",
        credentials: "include",
      }),
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
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useFetchProfileQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
