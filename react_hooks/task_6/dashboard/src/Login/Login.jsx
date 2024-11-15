import WithLogging from '../HOC/WithLogging';
import './Login.css';
import useLogin from '../hooks/useLogin';

function Login({ login }) {
  const {
    email,
    password,
    enableSubmit,
    handleChange,
    handleSubmit
  } = useLogin({
    onLogin: login
  });

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => {
  //     const newData = { ...prev, [name]: value };
  //     return {
  //       ...newData,
  //       enableSubmit: validateEmail(newData.email) && newData.password.length >= 8
  //     };
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   login(formData.email, formData.password);
  // };

  // return (
  //   <form aria-label="form" onSubmit={handleSubmit}>
  //     <div className="App-body">
  //       <p>Login to access the full dashboard</p>
  //       <div className="form">
  //         <label htmlFor="email">Email</label>
  //         <input
  //           type="email"
  //           name="email"
  //           id="email"
  //           value={formData.email}
  //           onChange={handleChange}
  //         />
  //         <label htmlFor="password">Password</label>
  //         <input
  //           type="text"
  //           name="password"
  //           id="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //         />
  //         <input
  //           value="OK"
  //           type="submit"
  //           disabled={!formData.enableSubmit}
  //         />
  //       </div>
  //     </div>
  //   </form>
  // );
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
            value={email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
          />
          <input
            type="submit"
            value="OK"
            disabled={!enableSubmit}
          />
        </div>
      </div>
    </form>
  );
}

export default WithLogging(Login);
