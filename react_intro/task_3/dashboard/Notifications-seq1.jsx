import './Notifications.css';
import closeIcon from './assets/close-icon.png';
import { getLatestNotification } from './src/utils';

function Notifications() {
  const buttonStyle = {
    position: 'absolute',
    right: '-480px',
    top: '-475px',
    transform: 'scale(0.012)',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
  };
  return (
    <div className='Notifications'>
      <p>here is the list of notifications</p>
      <button 
        aria-label='Close'
        onClick={() => console.log('cLOse BUTTON hAS bEen cLICKEd')}
        style={buttonStyle}
      >
        <img src={closeIcon} alt='close icon' />
      </button>
      <ul>
        <li data-priority="default">New course available</li>
        <li data-priority="urgent">New resume available</li>
        <li 
          data-priority="urgent" dangerouslySetInnerHTML={{__html: getLatestNotification()}}
        ></li>
      </ul>
    </div>
  )
}

export default Notifications; // Should FAIL