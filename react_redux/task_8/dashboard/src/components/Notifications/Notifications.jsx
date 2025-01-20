import { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead, showDrawer, hideDrawer } from '../../features/notifications/notificationsSlice';
import NotificationItem from '../NotificationItem/NotificationItem';
import './Notifications.css';
import closeIcon from '../../assets/close-icon.png';


const Notifications = memo(function Notifications () {
  const dispatch = useDispatch();
  const { notifications, displayDrawer } = useSelector((state) => state.notifications);

  const handleDisplayDrawer = useCallback(() => {
    dispatch(showDrawer());
  }, [dispatch]);

  const handleHideDrawer = useCallback(() => {
    dispatch(hideDrawer());
  }, [dispatch]);

  const handleMarkNotificationAsRead = useCallback((id) => {
    dispatch(markNotificationAsRead(id));
  }, [dispatch]);

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
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    value={notification.value}
                    html={notification.html}
                    markAsRead={handleMarkNotificationAsRead}
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
