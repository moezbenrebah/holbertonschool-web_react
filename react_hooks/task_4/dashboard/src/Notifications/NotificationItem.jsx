import { memo } from 'react';

const NotificationItem = memo(({ type, value, html, markAsRead, id }) => {
  console.log(`Rendering NotificationItem with id: ${id}, type: ${type}, value: ${value}`);

  console.log(`Rendering NotificationItem with id: ${id}, type: ${type}, value: ${value}`);

  return (
    <li
      style={{ color: type === 'default' ? 'blue' : 'red' }}
      data-notification-type={type}
      dangerouslySetInnerHTML={type === 'urgent' && html !== undefined ? html : undefined}
      onClick={() => markAsRead(id)}
    >
      {type === 'urgent' && html !== undefined ? null : value}
    </li>
  );
});

export default NotificationItem;
