'use client';
import React from 'react';
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/slices/notifications/notificationsApi';

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

  if (isLoading) return <NotificationSkeleton />;
  if (isError) return <NotificationError />;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
        {data.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="mark-all-button"
          >
            {markingAll ? (
              <span className="loading-dots">...</span>
            ) : (
              'Mark All as Read'
            )}
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <BellIcon />
          <p>No notifications yet</p>
          <small>We&apos;ll notify you when something arrives</small>
        </div>
      ) : (
        <div className="notifications-list">
          {data.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read_at ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="notification-indicator"></div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.data?.title}</h3>
                  {!notification.read_at && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification.id);
                      }}
                      disabled={markingSingle}
                      className="mark-read-button"
                    >
                      {markingSingle ? (
                        <span className="loading-dots">...</span>
                      ) : (
                        <CheckIcon />
                      )}
                    </button>
                  )}
                </div>
                <p className="notification-message">{notification.data?.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">
                    {formatTimeSince(notification.created_at)}
                  </span>
                  {notification.data?.type && (
                    <span className={`notification-tag ${notification.data.type}`}>
                      {notification.data.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper components
const BellIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const NotificationSkeleton = () => (
  <div className="notifications-container">
    <div className="notifications-header">
      <h2 className="notifications-title">Notifications</h2>
    </div>
    <div className="notifications-list">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="notification-skeleton">
          <div className="skeleton-indicator"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-message"></div>
            <div className="skeleton-footer">
              <div className="skeleton-time"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <style jsx>{`
      .notification-skeleton {
        background: white;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
      }
      
      .skeleton-indicator {
        width: 8px;
        height: 8px;
        background: #f0f0f0;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 8px;
      }
      
      .skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .skeleton-title,
      .skeleton-message,
      .skeleton-time {
        background: #f0f0f0;
        border-radius: 4px;
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-title {
        height: 16px;
        width: 60%;
      }
      
      .skeleton-message {
        height: 14px;
        width: 90%;
      }
      
      .skeleton-time {
        height: 12px;
        width: 40%;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

const NotificationError = () => (
  <div className="notifications-error">
    <div className="error-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3>Failed to load notifications</h3>
    <p>Please try again later</p>
    <button className="retry-button">Retry</button>
    <style jsx>{`
      .notifications-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
      }
      
      .error-icon {
        margin-bottom: 16px;
      }
      
      .notifications-error h3 {
        color: #ff4d4f;
        margin: 0 0 8px;
        font-size: 1.25rem;
      }
      
      .notifications-error p {
        color: #666;
        margin: 0 0 16px;
        font-size: 0.875rem;
      }
      
      .retry-button {
        background: #ff4d4f;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .retry-button:hover {
        background: #ff7875;
      }
    `}</style>
  </div>
);

// Helper function to format time since
function formatTimeSince(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default Notifications;