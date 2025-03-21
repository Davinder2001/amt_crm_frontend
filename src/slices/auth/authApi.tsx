import userCreateApiSlice from "./authCreateSlice";

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

    login: builder.mutation<{ access_token: string; user: Profile, message: string }, { number: string; password: string }>({
      query: (credentials) => ({
        url: "c-login",
        method: "POST",
        body: credentials,
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

    // Updated Forgot Password API to accept email
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "password/forgot",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Updated Verify OTP API to accept email
    verifyOtp: builder.mutation<void, { email: string; otp: string; password: string; password_confirmation: string }>({
      query: (data) => ({
        url: "password/verify-otp",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // New endpoint for Change Password
    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "password/change",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Send company id to selectedCompanies/{id}
    selectedCompany: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `selectedCompanies/${id}`,
        method: "POST",
        credentials: "include",
      }),
    }),

    fetchSelectedCompany: builder.query<SelectedCompanyResponse, void>({
      query: () => ({
        url: "selectedCompanies",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { 
  useFetchProfileQuery, 
  useLoginMutation, 
  useLogoutMutation, 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useChangePasswordMutation,
  useSelectedCompanyMutation,
  useFetchSelectedCompanyQuery
} = authApi;

export default authApi;
