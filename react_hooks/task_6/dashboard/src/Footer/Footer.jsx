// import './Footer.css';
// import { getCurrentYear, getFooterCopy } from '../utils/utils';

// export default function Footer({ isLoggedIn }) {
//   return (
//     <div className="App-footer">
//       <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
//       {isLoggedIn && <a href="#">Contact us</a>}
//     </div>
//   );
// }

import { getCurrentYear, getFooterCopy } from '../utils/utils';
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