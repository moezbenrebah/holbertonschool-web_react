import { useContext } from 'react';
import { getCurrentYear, getFooterCopy } from '../utils/utils';
import { newContext } from '../Context/context';
import './Footer.css';


export default function Footer() {
  const { user } = useContext(newContext);
  
  return (
    user ? (
      <div className="App-footer">
        <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
        {user.isLoggedIn && <a href="#">Contact us</a>}
      </div>
    ) : (null)
  )
}
