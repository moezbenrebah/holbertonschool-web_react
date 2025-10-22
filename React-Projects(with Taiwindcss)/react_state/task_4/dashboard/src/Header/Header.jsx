import { Component } from 'react';
import logo from '../assets/holberton-logo.jpg';
import newContext from '../Context/context';


class Header extends Component {
  static contextType = newContext;

  render() {
    const { user, logOut } = this.context;

    return (
      <>
        <div className="App-header flex items-center py-2 max-[520px]:flex-col">
          <img src={logo} className="App-logo h-60 pointer-events-none max-[520px]:h-60" alt="holberton logo" />
          <h1 className="font-bold text-[color:var(--main-color)] text-5xl max-[520px]:text-5xl max-[520px]:mt-2 max-[435px]:text-4xl">School Dashboard</h1>
        </div>
        {user.isLoggedIn && (
          <section id="logoutSection" className="cursor-pointer ml-auto text-lg">
            Welcome {user.email} <a href='#' onClick={logOut}>(logout)</a>
          </section>
        )}
      </>
    );
  }
}

export default Header;
