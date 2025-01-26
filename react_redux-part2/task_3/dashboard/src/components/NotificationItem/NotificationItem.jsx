import { memo } from 'react';

const NotificationItem = memo(function NotificationItem({ 
  type,
  value,
  markAsRead,
  id
}) {
  return (
    <li
      data-notification-type={type}
      onClick={() => markAsRead(id)}
      style={{ color: type === 'urgent' ? 'red' : 'blue' }}
    >
      {value}
    </li>
  );
});

export default NotificationItem;
