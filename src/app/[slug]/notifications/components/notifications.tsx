'use client';
import React from 'react';
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/slices/notifications/notifications';

const Notifications = () => {
  const { data, isLoading, isError, refetch } = useFetchNotificationsQuery();
  const [markNotificationAsRead, { isLoading: markingSingle }] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: markingAll }] = useMarkAllNotificationsAsReadMutation();

  const handleNotificationClick = async (id: string | number) => {
    try {
      await markNotificationAsRead(id);
      refetch(); // Refresh notifications after marking one
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      refetch(); // Refresh notifications after marking all
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Failed to load notifications!</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {(data?.notifications?.length ?? 0) > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
          >
            {markingAll ? "Marking..." : "Mark All as Read"}
          </button>
        )}
      </div>

      {data?.notifications?.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {data?.notifications?.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow-md ${notification.read_at ? 'bg-gray-100' : 'bg-white border border-blue-400'
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-md">{notification.data?.title}</strong>
                  <p className="text-sm text-gray-600">{notification.data?.message}</p>
                  <small className="text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
                {!notification.read_at ? (
                  <button
                    onClick={() => handleNotificationClick(notification.id)}
                    disabled={markingSingle}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full disabled:opacity-50"
                  >
                    {markingSingle ? "..." : "Mark as Read"}
                  </button>
                ) : (
                  <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Read
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
