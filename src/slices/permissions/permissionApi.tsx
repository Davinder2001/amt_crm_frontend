import userCreateApiSlice from "./permissionCreateSlice";

interface Permission {
  id: number;
  name: string;
}

interface PermissionsResponse {
  permissions: Permission[]; // Ensure the API returns an object with a "permissions" key
}

const permissionApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPermissions: builder.query<PermissionsResponse, void>({
      query: () => ({
        url: "api/v1/permissions",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useFetchPermissionsQuery } = permissionApi;

export default permissionApi;
