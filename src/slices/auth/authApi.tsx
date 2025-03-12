import userCreateApiSlice from "./authCreateSlice";

interface Meta {
  [key: string]: string;
}

interface Profile {
  id: number;
  name: string;
  number: string;
  company_id: number;
  company_name: string;
  company_slug: string;
  meta: Meta;
  user_type: string;
  password: string;
}

interface UsersResponse {
  user: Profile;
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

    login: builder.mutation<{ access_token: string; user: Profile }, { number: string; password: string }>({
      query: (credentials) => ({
        url: "login",
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
  }),
});

export const { 
  useFetchProfileQuery, 
  useLoginMutation, 
  useLogoutMutation, 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useChangePasswordMutation 
} = authApi;

export default authApi;
