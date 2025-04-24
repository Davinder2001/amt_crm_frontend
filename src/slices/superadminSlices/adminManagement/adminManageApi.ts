import adminCreateSlice from "./adminCreateSlice";

const adminManageApi = adminCreateSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all admins
    fetchAdmins: builder.query<any, void>({
      query: () => ({
        url: "admins-management",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    // POST: Update admin status
    updateAdminStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `admin-management/${id}/status`,
        method: "POST",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["Admin"],
    }),

    // GET: Fetch single admin by ID
    getAdminById: builder.query<any, string>({
      query: (id) => ({
        url: `admins/${id}`,
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useFetchAdminsQuery,
  useUpdateAdminStatusMutation,
  useGetAdminByIdQuery, 
} = adminManageApi;

export default adminManageApi;
