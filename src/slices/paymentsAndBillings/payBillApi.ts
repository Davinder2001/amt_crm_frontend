import userBillingApiSlice from "./payBillCreate";

const userApi = userBillingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAdminBilling: builder.query<any, void>({
      query: () => ({
        url: "billings",
        credentials: "include",
      }),
    }),
  }),
});

export const { useFetchAdminBillingQuery } = userApi;
export default userApi;
