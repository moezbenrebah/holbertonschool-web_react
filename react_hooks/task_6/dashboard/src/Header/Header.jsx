import './Header.css';
import logo from '../assets/holberton-logo.jpg';

export default function Header({ userEmail, isLoggedIn, logOut }) {
  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {isLoggedIn && (
        <div id="logoutSection">
          Welcome <b>{userEmail}</b> <a href="#" onClick={logOut}>(logout)</a>
        </div>
      )}
    </div>
  );
}