import { useContext } from 'react';
import './Header.css';
import logo from '../assets/holberton-logo.jpg';
import { newContext } from '../Context/context';

export default function Header() {
  const { user, logOut } = useContext(newContext);
  
  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {user.isLoggedIn ? (
        <div id="logoutSection">
          Welcome <b>{user.email}</b> <a href="" onClick={logOut}>(logout)</a>
        </div>
      ) : (null)}
    </div>
  );
}

// export default function Header() {
  
//   return (
//     <newContext.Consumer>
//       {
//         (context) => {
//           return (
//             <div className="App-header">
//               <img src={logo} className="App-logo" alt="holberton logo" />
//               <h1>School Dashboard</h1>
//               {context.user.isLoggedIn ? (
//                 <div id="logoutSection">
//                   Welcome <b>{context.user.email}</b> <a href="" onClick={context.logOut}>(logout)</a>
//                 </div>
//               ) : (null)}
//             </div>
//           )
//         }
//       }
//     </newContext.Consumer>
//   );
// }