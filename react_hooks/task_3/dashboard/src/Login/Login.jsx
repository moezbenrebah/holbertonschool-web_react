// import React from 'react';
// import WithLogging from '../HOC/WithLogging';
// import './Login.css';

// class Login extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       email: props.email || '',
//       password: props.password || '',
//       enableSubmit: false,
//     };
//   }

//   handleLoginSubmit = (e) => {
//     e.preventDefault();
//     const { email, password } = this.state;
//     this.props.login(email, password)
//   }

//   validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   handleChangeEmail = (e) => {
//     const email = e.target.value;
//     const { password } = this.state;

//     this.setState({
//       email: email,
//       enableSubmit: this.validateEmail(email) && password.length >= 8,
//     });
//   };

//   handleChangePassword = (e) => {
//     const password = e.target.value;
//     const { email } = this.state;
    
//     this.setState({
//       password: password,
//       enableSubmit: this.validateEmail(email) && password.length >= 8,
//     });
//   };

//   render() {
//     const { enableSubmit, email, password } = this.state;

//     return (
//       <form aria-label="form" onSubmit={this.handleLoginSubmit}>
//         <div className="App-body">
//           <p>Login to access the full dashboard</p>
//           <div className="form">
//             <label htmlFor="email">Email</label>
//             <input 
//               type="email" 
//               name="user_email" 
//               id="email" 
//               value={email}
//               onChange={this.handleChangeEmail}
//             />
//             <label htmlFor="password">Password</label>
//             <input 
//               type="text" 
//               name="user_password" 
//               id="password" 
//               value={password}
//               onChange={this.handleChangePassword}
//             />
//             <input
//               value="OK" 
//               type="submit"
//               disabled={!enableSubmit}
//             />
//           </div>
//         </div>
//       </form>
//     )
//   }
// }

// const LoginWithLogging = WithLogging(Login)
// export default LoginWithLogging;


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
            type="text"
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