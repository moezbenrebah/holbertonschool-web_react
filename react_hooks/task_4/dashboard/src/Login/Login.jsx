import { useState } from 'react';
import WithLogging from '../HOC/WithLogging';
import './Login.css';

const Login = ({ login, email = '', password = '' }) => {
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email,
    password
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = (e) => {
    const newEmail = e.target.value;
    const { password } = formData;
    
    setFormData(prev => ({
      ...prev,
      email: newEmail
    }));
    setEnableSubmit(validateEmail(newEmail) && password.length >= 8);
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    const { email } = formData;
    
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
    setEnableSubmit(validateEmail(email) && newPassword.length >= 8);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
    <form aria-label="form" onSubmit={handleLoginSubmit}>
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <div className="form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChangeEmail}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChangePassword}
          />
          <input
            value="OK"
            type="submit"
            disabled={!enableSubmit}
          />
        </div>
      </div>
    </form>
  );
}

export default WithLogging(Login);