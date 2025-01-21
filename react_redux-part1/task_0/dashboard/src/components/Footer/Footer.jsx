import { getCurrentYear, getFooterCopy } from '../../utils/utils';
import './Footer.css';

export default function Footer({ user }) {
  return (
    user ? (
      <div className="App-footer">
        <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
        {user.isLoggedIn && <a href="#">Contact us</a>}
      </div>
    ) : (null)
  );
}