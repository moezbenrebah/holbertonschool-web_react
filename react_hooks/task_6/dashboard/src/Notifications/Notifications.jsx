import { memo, useState } from 'react';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';


const Notifications = memo(function Notifications({
  displayDrawer,
  notifications,
  handleDisplayDrawer,
  handleHideDrawer,
  markNotificationAsRead
}) {
  return (
    <>
      <div className="notification-title" onClick={handleDisplayDrawer}>
        Your notifications
      </div>
      {displayDrawer && (
        <div className="Notifications">
          {notifications.length > 0 ? (
            <>
              <p>Here is the list of notifications</p>
              <button onClick={handleHideDrawer} aria-label="Close">
                <img src={closeIcon} alt="close icon" />
              </button>
              <ul>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    value={notification.value}
                    html={notification.html}
                    markAsRead={markNotificationAsRead}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p>No new notifications for now</p>
          )}
        </div>
      )}
    </>
  );
});

export default Notifications;