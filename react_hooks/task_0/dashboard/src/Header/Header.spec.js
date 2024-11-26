import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';
import { newContext } from '../Context/context';

export const convertHexToRGBA = (hexCode) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    console.log({hex})
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

test('should contain a <p/> element with specific text, <h1/>, and an <img/>', () => {
  render(<Header />);

  const headingElement = screen.getByRole('heading', {name: /school Dashboard/i});
  const imgElement = screen.getByAltText('holberton logo')

  expect(headingElement).toBeInTheDocument();
  expect(headingElement).toHaveStyle({color: convertHexToRGBA('#e1003c') })
  expect(imgElement).toBeInTheDocument();
});


// test('should return true if the Header component is a class component', () => {
// 	const props = Object.getOwnPropertyNames(Header.prototype);
// 	const isClassComponent = Header.prototype.__proto__ === React.Component.prototype;
// 	const inheritsFromReactComponent = Object.getPrototypeOf(Header.prototype) === React.Component.prototype;
	
// 	expect(props).toContain('constructor');
// 	expect(isClassComponent).toBe(true);
// 	expect(inheritsFromReactComponent).toBe(true);
// });

test('should confirm Header is a functional component', () => {
  const HeaderPrototype = Object.getOwnPropertyNames(Header.prototype);

  expect(HeaderPrototype).toEqual(expect.arrayContaining(["constructor"]))
  expect(HeaderPrototype).toHaveLength(1)
  expect(Header.prototype.__proto__).toEqual({})
});

// ======= Context test cases

describe('Header component', () => {
  const defaultUser = { isLoggedIn: false, email: '', password: '' };
  const loggedInUser = { isLoggedIn: true, email: 'user@example.com', password: 'password123' };

  test('does not display logoutSection when user is not logged in', () => {
    render(
      <newContext.Provider value={{ user: defaultUser, logOut: jest.fn() }}>
        <Header />
      </newContext.Provider>
    );

    const logoutSection = screen.queryByText(/logout/i);
    expect(logoutSection).not.toBeInTheDocument();
  });

  test('displays logoutSection when user is logged in', () => {
    render(
      <newContext.Provider value={{ user: loggedInUser, logOut: jest.fn() }}>
        <Header />
      </newContext.Provider>
    );

    const logoutSection = screen.getByText(/logout/i);
    expect(logoutSection).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
  });

  test('calls logOut function when logout link is clicked', () => {
    const logOutSpy = jest.fn();
    render(
      <newContext.Provider value={{ user: loggedInUser, logOut: logOutSpy }}>
        <Header />
      </newContext.Provider>
    );

    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);

    expect(logOutSpy).toHaveBeenCalled();
  });

  test('displays logoutSection when user is logged in', () => {
    const { container } = render(
      <newContext.Provider value={{ user: loggedInUser, logOut: jest.fn() }}>
        <Header />
      </newContext.Provider>
    );

    const logoutSection = container.querySelector("div#logoutSection");
    expect(logoutSection).toBeInTheDocument()
  });
});


// ======= test useContext

jest.mock('../assets/holberton-logo.jpg', () => 'mocked-path.jpg');

describe('Header Component', () => {
  // Helper function to wrap component with context
  const renderWithContext = (contextValue) => {
    return render(
      <newContext.Provider value={contextValue}>
        <Header />
      </newContext.Provider>
    );
  };

  // Test cases for logged out state
  describe('When user is logged out', () => {
    const contextValue = {
      user: { isLoggedIn: false, email: '' },
      logOut: jest.fn()
    };

    beforeEach(() => {
      renderWithContext(contextValue);
    });

    it('renders basic header elements', () => {
      expect(screen.getByRole('img')).toHaveAttribute('src', 'mocked-path.jpg');
      expect(screen.getByRole('heading')).toHaveTextContent('School Dashboard');
    });

    it('does not render logout section', () => {
      expect(screen.queryByTestId('logoutSection')).not.toBeInTheDocument();
    });
  });

  // Test cases for logged in state
  describe('When user is logged in', () => {
    const mockLogOut = jest.fn();
    const contextValue = {
      user: { 
        isLoggedIn: true, 
        email: 'test@test.com',
        password: '12345678'
      },
      logOut: mockLogOut
    };

    beforeEach(() => {
      renderWithContext(contextValue);
    });

    it('renders welcome message with user email', () => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
    });

    it('renders logout link', () => {
      expect(screen.getByText('(logout)')).toBeInTheDocument();
    });

    it('calls logOut function when logout link is clicked', () => {
      fireEvent.click(screen.getByText('(logout)'));
      expect(mockLogOut).toHaveBeenCalledTimes(1);
    });

    it('prevents default behavior on logout link click', () => {
      const logoutLink = screen.getByText('(logout)');
      fireEvent.click(logoutLink);
      expect(mockLogOut).toHaveBeenCalled();
    });
  });
});
