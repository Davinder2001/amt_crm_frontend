'use client';
import React from 'react';
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/slices/notifications/notifications';

type NotificationData = {
  title?: string;
  message?: string;
  type?: string;
  url?: string;
};

type NotificationType = {
  id: string | number;
  read_at: string | null;
  created_at: string;
  data: NotificationData;
};

const Notifications = () => {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useFetchNotificationsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      data: (result.data ?? []) as NotificationType[],
    }),
  });

  const [markNotificationAsRead, { isLoading: markingSingle }] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: markingAll }] = useMarkAllNotificationsAsReadMutation();

  const handleNotificationClick = async (id: string | number) => {
    try {
      await markNotificationAsRead(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Failed to load notifications!</div>;

  return (
    <div className="">
      <div className="">
        <h2 className="">Notifications</h2>
        {data.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className=""
          >
            {markingAll ? 'Marking...' : 'Mark All as Read'}
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="">
          {data.map((notification) => (
            <li
              key={notification.id}
              className={` ${
                notification.read_at ? '' : ''
              }`}
            >
              <div className="">
                <div>
                  <strong className="">{notification.data?.title}</strong>
                  <p className="">{notification.data?.message}</p>
                  <small className="">
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
                {!notification.read_at ? (
                  <button
                    onClick={() => handleNotificationClick(notification.id)}
                    disabled={markingSingle}
                    className=""
                  >
                    {markingSingle ? '...' : 'Mark as Read'}
                  </button>
                ) : (
                  <span className="">
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
