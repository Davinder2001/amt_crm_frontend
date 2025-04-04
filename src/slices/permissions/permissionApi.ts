import userCreateApiSlice from "./permissionCreateSlice";

const permissionApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPermissions: builder.query<GroupedPermissions[], void>({
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
