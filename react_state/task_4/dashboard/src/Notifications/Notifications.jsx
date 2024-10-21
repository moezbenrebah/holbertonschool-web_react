import { PureComponent } from 'react';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {  
      displayDrawer, 
      handleDisplayDrawer, 
      handleHideDrawer,
      notifications
    } = this.props;

    const { markNotificationAsRead } = this.props

    return (
      <>
        <div className="notification-title" onClick={handleDisplayDrawer}>
          Your notifications
        </div>
        {
          displayDrawer ? (
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
          ) : null
        }
      </>
    );
  }
}

export default Notifications
