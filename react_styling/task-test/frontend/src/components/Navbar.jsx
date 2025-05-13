import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCamera } from "@fortawesome/free-solid-svg-icons";

// Component for navigation links used in both desktop and mobile menus
const NavLinks = ({ isMobile = false, onLinkClick }) => (
  <>

  {/*** / Link to Features page** ***/}
    <Link
      to="/"
      className={`${isMobile ? 'hover:text-yellow-800 py-2' : 'hover:text-yellow-900 flex items-center gap-2'}`}
      onClick={onLinkClick}
    >
      Features
    </Link>

{/* Link to Signup page */}
    <Link
      to="/signup"
      className={`${isMobile ? 'hover:text-yellow-800 py-2' : 'hover:text-yellow-900 flex items-center gap-2'}`}
      onClick={onLinkClick}
    >
      Signup
    </Link>

{/* Link to Login page with different styling on desktop */}

    <Link
      to="/login"
      className={`${isMobile
        ? 'hover:text-yellow-800 py-2'
        : 'bg-gradient-to-br from-green-100 to-blue-100 text-black py-2 px-6 rounded-lg font-medium hover:text-black transition'
      }`}
      onClick={onLinkClick}
    >
      Login
    </Link>
  </>
);

const Navbar = () => {

  // State to track if the mobile menu is open or not
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="text-black p-2">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        
      {/* Logo section with camera icon and brand name */}

        <div className="flex items-center -ml-2">
          <FontAwesomeIcon icon={faCamera} className="text-3xl mr-2" />
          <span className="text-5xl font-lavish">ShutterUp</span>
        </div>

        {/* Menu toggle button for mobile view */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Desktop navigation menu (visible on medium and larger screens) */}
        <div className="hidden md:flex items-center space-x-6 text-1xl">
          <NavLinks />
        </div>
      </div>

      {/* Mobile navigation menu (visible when menu is open)*/}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-3">
            <NavLinks isMobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
