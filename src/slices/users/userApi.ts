import userCreateApiSlice from "./userCreateSlice";

const userApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: "users",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    createUser: builder.mutation<UserProfile, CreateUserRequest>({
      query: (newUser) => ({
        url: "users",
        method: "POST",
        body: newUser,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUser: builder.mutation<
      UserProfile,
      { id: number; name: string; email: string; }
    >({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    fetchPackagesPlans: builder.query<PackagePlanResponse, void>({
      query: () => ({
        url: "all-packages",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    fetchBusinessCategories: builder.query<BusinessCategory[], void>({
      query: () => ({
        url: "all-business-categories",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    sendOtp: builder.mutation<void, { number: string }>({
      query: (otp) => ({
        url: "send-wp-otp",
        method: "POST",
        body: otp,
      }),
    }),

    verifyOtp: builder.mutation<void, { number: string, otp: string }>({
      query: (otp) => ({
        url: "verify-wp-otp",
        method: "POST",
        body: otp,
      }),
    }),

  }),
});

export const {
  useFetchUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useFetchPackagesPlansQuery,
  useFetchBusinessCategoriesQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = userApi;

export default userApi;
