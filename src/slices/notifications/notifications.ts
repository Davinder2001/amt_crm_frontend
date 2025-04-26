import invoiceCreateApiSlice from "./notificationsCreateSlice";

const notificationApi = invoiceCreateApiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({

    fetchNotifications: builder.query<any, void>({
      query: () => "notifications",
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation<any, void>({
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
} = notificationApi;

export default notificationApi;
