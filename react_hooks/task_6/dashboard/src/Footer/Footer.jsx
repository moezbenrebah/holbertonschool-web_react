import './Footer.css';
import { getCurrentYear, getFooterCopy } from '../utils/utils';

export default function Footer({ isLoggedIn }) {
  return (
    <div className="App-footer">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
      {isLoggedIn && <a href="#">Contact us</a>}
    </div>
  );
}
