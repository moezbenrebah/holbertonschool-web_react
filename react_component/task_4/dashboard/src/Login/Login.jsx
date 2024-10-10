import WithLogging from '../HOC/WithLogging';
import './Login.css';

// function Login() {
//   return (
//     <div className="App-body">
//       <p>Login to access the full dashboard</p>
//       <div className="form">
//         <label htmlFor="email">Email</label>
//         <input type="email" name="user_email" id="email" />
//         <label htmlFor="password">Password</label>
//         <input type="text" name="user_password" id="password" />
//         <button>OK</button>
//       </div>
//     </div>
//   )
// }

// const LoginWithLogging = WithLogging(Login)
// export default LoginWithLogging;

export default WithLogging(() => {
  return (
    <div className="App-body">
      <p>Login to access the full dashboard</p>
      <div className="form">
        <label htmlFor="email">Email</label>
        <input type="email" name="user_email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="text" name="user_password" id="password" />
        <button>OK</button>
      </div>
    </div>
  )
});
