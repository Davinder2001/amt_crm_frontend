import userBillingApiSlice from "./payBillCreate";

const userApi = userBillingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAdminBilling: builder.query<AdminBillingResponse, void>({
      query: () => ({
        url: "payments",
        credentials: "include",
      }),
    }),

    createRefund: builder.mutation<void, { transaction_id: string, formdata: FormData }>({
      query: ({ transaction_id, formdata }) => ({
        url: `payments/refund-request/${transaction_id}`,
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["Billing"],
    }),

  }),
});

export const { useFetchAdminBillingQuery, useCreateRefundMutation } = userApi;
export default userApi;
