import { useContext } from 'react';
import './Footer.css';
import { getCurrentYear, getFooterCopy } from '../utils/utils';
import { newContext } from '../Context/context';

export default function Footer() {
  const { user } = useContext(newContext);
  
  if (!user) return null;
  
  return (
    <div className="App-footer">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
      {user.isLoggedIn && <a href="#">Contact us</a>}
    </div>
  );
}
