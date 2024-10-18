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