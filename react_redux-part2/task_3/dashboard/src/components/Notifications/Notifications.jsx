import { memo, useCallback, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead } from '../../features/notifications/notificationsSlice';
import NotificationItem from '../NotificationItem/NotificationItem';
import { getFilteredNotifications } from '../../features/selectors/notificationSelector';
import './Notifications.css';
import closeIcon from '../../assets/close-icon.png';


const Notifications = memo(function Notifications() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notifications);
  const [currentFilter, setCurrentFilter] = useState('all');
  const filteredNotifications = useSelector(state => 
    getFilteredNotifications(state, currentFilter)
  );
  const DrawerRef = useRef(null);

  const handleToggleDrawer = useCallback(() => {
    DrawerRef.current.classList.toggle('visible');
  }, []);

  const handleSetFilterUrgent = useCallback(() => {
    setCurrentFilter(prev => prev === 'urgent' ? 'all' : 'urgent');
  }, []);

  const handleSetFilterDefault = useCallback(() => {
    setCurrentFilter(prev => prev === 'default' ? 'all' : 'default');
  }, []);
  
  const handleMarkNotificationAsRead = useCallback((id) => {
    dispatch(markNotificationAsRead(id));
  }, [dispatch]);

  return (
    <>
      <div className="notification-title" onClick={handleToggleDrawer}>
        Your notifications
      </div>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <>
          <div className="Notifications visible" ref={DrawerRef}>
            {filteredNotifications.length > 0 ? (
              <>
                <p>Here is the list of notifications</p>
                <button onClick={handleToggleDrawer} aria-label="Close">
                  <img src={closeIcon} alt="close icon" />
                </button>
                <div>
                  <button className='urgent' onClick={handleSetFilterUrgent}>‼️</button>
                  <button className='default' onClick={handleSetFilterDefault}>?</button>
                </div>
                <ul>
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      type={notification.type}
                      value={notification.value}
                      markAsRead={handleMarkNotificationAsRead}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <p>No new notifications for now</p>
            )}
          </div>
        </>
      )}
    </>
  );
});

export default Notifications;
