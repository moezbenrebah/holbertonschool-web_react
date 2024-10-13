import React from 'react';
import WithLogging from '../HOC/WithLogging';
import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      email: '',
      password: '',
      enableSubmit: false,
    };
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoggedIn: true })
  }

  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // handleChangeEmail = (e) => {
  //   const { password } = this.state;
  //   this.setState({ email: e.target.value, enableSubmit: e.target.value !== '' && password.length >= 8 });
  // }

  // handleChangePassword = (e) => {
  //   const { email } = this.state;
  //   this.setState({ password: e.target.value, enableSubmit: e.target.value !== '' && this.validateEmail(email) });
  // }

  handleChangeEmail = (e) => {
    const email = e.target.value;
    const { password } = this.state;

    this.setState({
      email: email,
      enableSubmit: this.validateEmail(email) && password.length >= 8,
    });
  };

  handleChangePassword = (e) => {
    const password = e.target.value;
    const { email } = this.state;
    
    this.setState({
      password: password,
      enableSubmit: this.validateEmail(email) && password.length >= 8,
    });
  };

  render() {
    const {email, password, enableSubmit } = this.state;
    return (
      <form action="" onSubmit={this.handleLoginSubmit}>
        <div className="App-body">
          <p>Login to access the full dashboard</p>
          <div className="form">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="user_email" 
              id="email" 
              value={email}
              onChange={this.handleChangeEmail}
            />
            <label htmlFor="password">Password</label>
            <input 
              type="text" 
              name="user_password" 
              id="password" 
              value={password}
              onChange={this.handleChangePassword}
            />
            <input
              value="OK" 
              type="submit"
              disabled={!enableSubmit}
            />
          </div>
        </div>
      </form>
    )
  }
}

const LoginWithLogging = WithLogging(Login)
export default LoginWithLogging;
