import { useState } from "react";
import WithLogging from "../HOC/WithLogging";


const Login = ({ logIn, email = "", password = "" }) => {
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email,
    password,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = (e) => {
    const newEmail = e.target.value;
    const { password } = formData;

    setFormData((prev) => ({
      ...prev,
      email: newEmail,
    }));
    setEnableSubmit(validateEmail(newEmail) && password.length >= 8);
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    const { email } = formData;

    setFormData((prev) => ({
      ...prev,
      password: newPassword,
    }));
    setEnableSubmit(validateEmail(email) && newPassword.length >= 8);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    logIn(formData.email, formData.password);
  };

  return (
    <div className="App-body flex flex-col p-5 pl-1 h-[45vh] border-t-4 border-[color:var(--main-color)]">
      <p className="text-xl mb-4">Login to access the full dashboard</p>
      <form className="text-lg flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0" onSubmit={handleLoginSubmit}>
        <label htmlFor="email" className="sm:pr-2">
          Email
        </label>
        <input
          type="email"
          name="user_email"
          id="email"
          className="border rounded w-3/5 sm:w-auto px-2 py-1"
          value={formData.email}
          onChange={handleChangeEmail}
        />
        <label htmlFor="password" className="sm:pl-2 sm:pr-2">
          Password
        </label>
        <input
          type="password"
          name="user_password"
          id="password"
          className="border rounded w-3/5 sm:w-auto px-2 py-1"
          value={formData.password}
          onChange={handleChangePassword}
        />
        <button
          type="submit"
          className="cursor-pointer border px-2 py-1 rounded sm:ml-2 w-fit disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
          disabled={!enableSubmit}
        >OK</button>
      </form>
    </div>
  );
};

export default WithLogging(Login);
