import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

export default function Notifications({ notifications }) {
  console.log(notifications)
  return (
    <div className='Notifications'>
      <p>Here is the list of notifications</p>
      <ul>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            value={notification.value}
            html={notification.html}
          />
        ))}
      </ul>
      <button
        aria-label='Close'
        type='button'
        onClick={() => console.log('Close button has been clicked')}
      >
        <img
          alt='close-icon'
          src={closeIcon}
        />
      </button>
    </div>
  );
}
