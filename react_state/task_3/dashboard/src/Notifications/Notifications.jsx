import React from 'react';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

class Notifications extends React.Component {
  constructor(props) {
    super(props)
  }

  markAsRead = (id) => {
    console.log(`Notification ${id + 1} has been marked as read`);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.notifications.length !== nextProps.notifications.length ||
      this.props.displayDrawer !== nextProps.displayDrawer
    );
  }

  render() {
    const { notifications = [], displayDrawer = false } = this.props;

    return (
      <>
        <div className="notification-title" onClick={() => this.props.handleDisplayDrawer()}>Your notifications</div>
        {
          displayDrawer ? (
            <div className='Notifications'>
              {notifications.length > 0 ? (
                <>
                  <p>Here is the list of notifications</p>
                  <button
                    onClick={() => this.props.handleHideDrawer()}
                    aria-label='Close'
                  >
                    <img src={closeIcon} alt='close icon' />
                  </button>
                  <ul>
                    {notifications.map((notification, index) => (
                      <NotificationItem
                        id={index}
                        key={notification.id}
                        type={notification.type}
                        value={notification.value}
                        html={notification.html}
                        markAsRead={this.markAsRead}
                      />
                    ))}
                  </ul>
                </>
              ) : (
                <p>No new notification for now</p>
              )}
            </div>
          ) :
          ([])
        }
      </>
    );
  }
}

export default Notifications
