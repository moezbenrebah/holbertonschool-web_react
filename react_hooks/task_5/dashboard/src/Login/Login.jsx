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
