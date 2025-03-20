import userCreateApiSlice from "./authCreateSlice";

interface Meta {
  [key: string]: string | number | boolean | object; // Allow for flexible meta data
}

interface Company {
  id: number; // Updated to number
  admin_id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  created_at: string;
  payment_status: string;
  updated_at: string;
  verification_status: string;
  [key: string]: string | number; // Allow for additional fields
}

interface Profile {
  id: number;
  name: string;
  number: string;
  company_id: number;
  company_name: string;
  company_slug: string;
  meta: Meta;
  user_type: "admin" | "employee" | "user" | "superadmin"; // Union type for user_type
  password: string;
  companies: Company[]; // Updated to array of Company objects
}

interface UsersResponse {
  user: Profile;
}

// Response type for fetching selected company
interface SelectedCompanyResponse {
  company_user_role: "admin" | "employee" | "user" | "superadmin";
  selected_company: Profile
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
    // send company id to selectedCompanies/{id}
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