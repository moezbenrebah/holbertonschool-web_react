import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Header.css';
import logo from '../../assets/holberton-logo.jpg';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {user.isLoggedIn ? (
        <div id="logoutSection">
          Welcome <b>{user.email}</b> <a href="#" onClick={handleLogout}>(logout)</a>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
