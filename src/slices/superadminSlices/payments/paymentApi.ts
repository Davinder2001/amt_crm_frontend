import paymentCreateApiSlice from "./paymentCreateSlice";

const paymentApi = paymentCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all refund requests
        fetchRefunds: builder.query<RefundListResponse, void>({
            query: () => ({
                url: '/payments/refunds',
                method: 'GET',
            }),
            providesTags: ['Payments'],
        }),

        // Approve refund
        approveRefund: builder.mutation<RefundActionResponse, string>({
            query: (transactionId) => ({
                url: `/payments/refund-approve/${transactionId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Payments'],
        }),

        // Mark refund as completed
        completeRefund: builder.mutation<RefundActionResponse, string>({
            query: (transactionId) => ({
                url: `/payments/refund-complete/${transactionId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Payments'],
        }),

        // Decline refund
        declineRefund: builder.mutation<RefundActionResponse, { transactionId: string; reason: string }>({
            query: ({ transactionId, reason }) => ({
                url: `/payments/refund-decline/${transactionId}`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Payments'],
        }),

    })
});

export const {
    useFetchRefundsQuery,
    useApproveRefundMutation,
    useCompleteRefundMutation,
    useDeclineRefundMutation,
} = paymentApi;

export default paymentApi;