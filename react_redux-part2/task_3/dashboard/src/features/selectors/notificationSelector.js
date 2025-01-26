import { createSelector } from 'reselect';

const selectNotifications = (state) => state.notifications.notifications;

export const getFilteredNotifications = createSelector(
  [selectNotifications, (_, filter) => filter],
  (notifications, filter) => {
    return notifications.filter(notification => {
      const matchesUnread = !notification.isRead;
      const matchesType = filter === 'all' || notification.type === filter;
      return matchesUnread && matchesType;
    });
  }
);
