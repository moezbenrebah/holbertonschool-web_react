import { useState } from 'react';
import WithLogging from '../HOC/WithLogging';
import './Login.css';

function Login({ login }) {
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    const { password } = formData;
    setFormData(prev => ({
      ...prev,
      email
    }));
    setEnableSubmit(validateEmail(email) && password.length >= 8);
  };

  const handleChangePassword = (e) => {
    const password = e.target.value;
    const { email } = formData;
    setFormData(prev => ({
      ...prev,
      password
    }));
    setEnableSubmit(validateEmail(email) && password.length >= 8);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    login(email, password);
  };

  return (
    <form aria-label="form" onSubmit={handleLoginSubmit}>
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <div className="form">
          <label for="email">Email</label>
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

const LoginWithLogging = WithLogging(Login);
export default LoginWithLogging;
