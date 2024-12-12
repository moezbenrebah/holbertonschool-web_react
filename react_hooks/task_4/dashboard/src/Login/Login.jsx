import { useState } from 'react';
import WithLogging from '../HOC/WithLogging';
import './Login.css';

function Login({ login, email: initialEmail = '', password: initialPassword = '' }) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: initialPassword,
    enableSubmit: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      return {
        ...newData,
        enableSubmit: validateEmail(newData.email) && newData.password.length >= 8
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
    <form aria-label="form" onSubmit={handleSubmit}>
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <div className="form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            value="OK"
            type="submit"
            disabled={!formData.enableSubmit}
          />
        </div>
      </div>
    </form>
  );
}

export default WithLogging(Login);
