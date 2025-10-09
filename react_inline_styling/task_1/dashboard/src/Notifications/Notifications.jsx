import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

const styles = StyleSheet.create({
  notificationItems: {
    position: 'relative',
    border: '3px dotted #e1003c',
    padding: '5px',
    fontFamily: 'Roboto, sans-serif',
    width: '25%',
    float: 'right',
    marginTop: '20px'
  },
  p: {
    margin: 0
  },
  button: {
    position: 'absolute',
    cursor: 'pointer',
    right: 'calc(0% - 480px)',
    top: 'calc(0% - 480px)',
    background: 'transparent',
    transform: 'scale(0.012)',
    WebkitTransform: 'scale(0.012)',
    MozTransform: 'scale(0.012)',
    msTransform: 'scale(0.012)',
    OTransform: 'scale(0.012)'
  },
  notificationTitle: {
    float: 'right',
    position: 'absolute',
    right: '10px',
    top: '2px'
  }
});

class Notifications extends React.Component {
  constructor(props) {
    super(props)
  }

  markAsRead = (id) => {
    console.log(`Notification ${id} has been marked as read`);
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
        <div className={css(styles.notificationTitle)}>Your notifications</div>
        {
          displayDrawer ? (
            <div className={css(styles.notificationItems)}>
              {notifications.length > 0 ? (
                <>
                  <p className={css(styles.p)}>Here is the list of notifications</p>
                  <button
                    onClick={() => console.log('Close button has been clicked')}
                    aria-label='Close'
                    className={css(styles.button)}
                  >
                    <img src={closeIcon} alt='close icon' />
                  </button>
                  <ul>
                    {notifications.map((notification) => (
                      <NotificationItem
                        id={notification.id}
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
                <p className={css(styles.p)}>No new notification for now</p>
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
