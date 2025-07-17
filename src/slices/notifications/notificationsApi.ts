import invoiceCreateApiSlice from "./notificationsCreateSlice";

const notificationsApi = invoiceCreateApiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    fetchNotifications: builder.query<NotificationResponse, void>({
      query: () => "notifications",
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation<MarkNotificationResponse, string | number>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation<MarkNotificationResponse, void>({
      query: () => ({
        url: "notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

  }),
});

export const {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApi;

export default notificationsApi;
