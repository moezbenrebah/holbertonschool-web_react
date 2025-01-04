import './Header.css';
import logo from '../../assets/holberton-logo.jpg';

export default function Header({ user, logOut }) {
  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {user.isLoggedIn ? (
        <div id="logoutSection">
          Welcome <b>{user.email}</b> <a href="#" onClick={logOut}>(logout)</a>
        </div>
      ) : null}
    </div>
  );
}
