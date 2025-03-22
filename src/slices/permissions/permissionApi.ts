import userCreateApiSlice from "./permissionCreateSlice";

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

const permissionApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPermissions: builder.query<Permission[], void>({
      query: () => ({
        url: "permissions",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useFetchPermissionsQuery } = permissionApi;
export default permissionApi;
