import userCreateApiSlice from "./authCreateSlice";

interface Profile {
  id: number;
  name: string;
  number: number; // updated from email to number
  company_id: number;
  company_name: string;
  company_slug: string;
}

interface UsersResponse {
  user: Profile; // Ensure the API returns an object with a "user" key
}

const authApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProfile: builder.query<UsersResponse, void>({
      query: () => ({
        url: "user",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    login: builder.mutation<{ access_token: string; user: Profile }, { number: number; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials, // now sends { number, password }
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
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
