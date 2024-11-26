import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';


const Notifications = memo(function Notifications({
  displayDrawer,
  handleDisplayDrawer,
  handleHideDrawer,
  notifications,
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
                    markAsRead={() => markNotificationAsRead(notification.id)}
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
}, (prevProps, nextProps) => {
  // Compare notifications array
  const DidNotificationsUpdated = 
    prevProps.notifications.length === nextProps.notifications.length &&
    prevProps.notifications.every((notification, index) => {
      const prevNotif = prevProps.notifications[index];
      const nextNotif = nextProps.notifications[index];
      return (
        prevNotif.id === nextNotif.id &&
        prevNotif.type === nextNotif.type &&
        prevNotif.value === nextNotif.value &&
        prevNotif.html === nextNotif.html
      );
    });

  return DidNotificationsUpdated;
});

export default Notifications;
