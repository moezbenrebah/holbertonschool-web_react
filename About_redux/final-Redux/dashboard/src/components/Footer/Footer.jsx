import { useSelector } from 'react-redux';
import { getCurrentYear, getFooterCopy } from '../../utils/utils';
import './Footer.css';

export default function Footer() {
  const { user } = useSelector((state) => state.auth);

  return (
    user ? (
      <div className="App-footer">
        <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
        {user.isLoggedIn && <a href="#">Contact us</a>}
      </div>
    ) : (null)
  );
};
