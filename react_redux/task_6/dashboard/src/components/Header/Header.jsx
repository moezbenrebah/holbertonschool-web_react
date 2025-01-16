// import './Header.css';
// import logo from '../../assets/holberton-logo.jpg';

// export default function Header({ user, logOut }) {
//   return (
//     <div className="App-header">
//       <img src={logo} className="App-logo" alt="holberton logo" />
//       <h1>School Dashboard</h1>
//       {user.isLoggedIn ? (
//         <div id="logoutSection">
//           Welcome <b>{user.email}</b> <a href="#" onClick={logOut}>(logout)</a>
//         </div>
//       ) : null}
//     </div>
//   );
// }

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Header.css';
import logo from '../../assets/holberton-logo.jpg';


export default function Header() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {isLoggedIn ? (
        <div id="logoutSection">
          Welcome <b>{user.email}</b> <a href="#" onClick={handleLogout}>(logout)</a>
        </div>
      ) : null}
    </div>
  );
};
