import React from 'react';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props)
  }

  markAsRead = (id) => {
    console.log(`Notification ${id + 1} has been marked as read`);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.notifications.length !== nextProps.notifications.length ||
      this.props.displayDrawer !== nextProps.displayDrawer
    );
  }

  render() {
    const { notifications = [], displayDrawer = true } = this.props;

    return (
      <>
        <div className="notification-title absolute right-3 top-1">Your notifications</div>
        {
          displayDrawer ? (
            <div className='Notifications relative border-[3px] border-dotted border-[color:var(--main-color)] p-1.5 w-1/4 float-right mt-7'>
              {notifications.length > 0 ? (
                <div className='relative'>
                  <p className="m-0">Here is the list of notifications</p>
                  <button
                    onClick={() => console.log('Close button has been clicked')}
                    aria-label='Close'
                    className="absolute cursor-pointer right-0 top-0 bg-transparent"
                  >
                    <img src={closeIcon} alt='close icon' className="w-3 h-3" />
                  </button>
                  <ul className='list-[square] pl-5'>
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
                </div>
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
