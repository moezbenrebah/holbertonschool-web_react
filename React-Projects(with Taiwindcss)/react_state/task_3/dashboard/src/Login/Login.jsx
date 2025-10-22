import { Component } from 'react';
import WithLogging from '../HOC/WithLogging';


class Login extends Component {
  constructor(props) {
    super(props);
    const { email = '', password = '' } = this.props;
    this.state = {
      email,
      password,
      enableSubmit: false
    };
  }

  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm = (email, password) => {
    const isEmailValid = this.isValidEmail(email);
    const isPasswordValid = password.length >= 8;
    return isEmailValid && isPasswordValid && email !== '' && password !== '';
  }

  handleChangeEmail = (e) => {
    const email = e.target.value;
    this.setState({
      email,
      enableSubmit: this.validateForm(email, this.state.password)
    });
  }

  handleChangePassword = (e) => {
    const password = e.target.value;
    this.setState({
      password,
      enableSubmit: this.validateForm(this.state.email, password)
    });
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    const { logIn } = this.props;
    if (logIn) {
      logIn(this.state.email, this.state.password);
    }
  }

  render() {
    const { email, password, enableSubmit } = this.state;

    return (
      <div className="App-body flex flex-col p-5 pl-1 h-[45vh] border-t-4 border-[color:var(--main-color)]">
        <p className="text-xl mb-4">Login to access the full dashboard</p>
        <form className="text-lg flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0" onSubmit={this.handleLoginSubmit}>
          <label htmlFor="email" className="sm:pr-2">Email</label>
          <input
            type="email"
            name="user_email"
            id="email"
            className="border rounded w-3/5 sm:w-auto px-2 py-1"
            value={email}
            onChange={this.handleChangeEmail}
          />
          <label htmlFor="password" className="sm:pl-2 sm:pr-2">Password</label>
          <input
            type="password"
            name="user_password"
            id="password"
            className="border rounded w-3/5 sm:w-auto px-2 py-1"
            value={password}
            onChange={this.handleChangePassword}
          />
          <button
            type="submit"
            className="cursor-pointer border px-2 py-1 rounded sm:ml-2 w-fit disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
            disabled={!enableSubmit}
          >OK</button>
        </form>
      </div>
    );
  }
}

const LoginWithLogging = WithLogging(Login)
export default LoginWithLogging;
