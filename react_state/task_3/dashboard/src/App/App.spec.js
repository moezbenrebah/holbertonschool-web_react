import React from 'react'
import { act, render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { newContext } from '../Context/context';


const mockBodySection = jest.fn();
jest.mock("../BodySection/BodySection", () => {
  const MockBodySection = (props) => {
    mockBodySection(props);
    return (
      <div>
        <h2>{props.title}</h2>
        {props.children}
      </div>
    );
  };
  MockBodySection.displayName = 'MockBodySection';
  return MockBodySection;
});

test('should return true if the App component is a class component', () => {
  const props = Object.getOwnPropertyNames(App.prototype);
  const isClassComponent = App.prototype.__proto__ === React.Component.prototype;
  const inheritsFromReactComponent = Object.getPrototypeOf(App.prototype) === React.Component.prototype;
  
  expect(props).toContain('constructor');
  expect(isClassComponent).toBe(true);
  expect(inheritsFromReactComponent).toBe(true);
});

describe('test alert window message', () => {
  beforeEach(() => {
    jest.spyOn(document, 'addEventListener');
    jest.spyOn(document, 'removeEventListener');
  });
  
  afterEach(() => {
    document.addEventListener.mockRestore();
    document.removeEventListener.mockRestore();
  });

  test('it should call the logOut prop once whenever the user hits "Ctrl" + "h" keyboard keys', () => {
    const logOutMock = jest.fn();

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App isLoggedIn={true} logOut={logOutMock} />);

    fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });

    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  test('it should display an alert window whenever the user hit "ctrl" + "h" keyboard keys', () => {
    const logoutSpy = jest.fn();
    window.alert = jest.fn();
    
    render(<App logOut={logoutSpy} />);
    
    fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
    
    expect(window.alert).toHaveBeenCalledWith('Logging you out');
  });

  test('should remove event listener in componentWillUnmount', () => {
    const { unmount } = render(<App isLoggedIn={false} />);

    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  test('should add event listener in componentDidMount', () => {
    render(<App isLoggedIn={false} />);

    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

})

test('it should add the title of "Log in to continue" above the Login component when the isLoggedIn prop set to false', () => {
  render(<App isLoggedIn={false} />)

  expect(screen.getByRole('heading', { name: /log in to continue/i })).toBeInTheDocument();
});

test('should render BodySection as a child component', () => {
  render(<App isLoggedIn={false} />);

  expect(mockBodySection).toHaveBeenCalled();
});

test('should render BodySection with news when logged in', () => {
  render(<App isLoggedIn={true} />);

  expect(mockBodySection).toHaveBeenCalled();
});

test('it should render a heading element with a text "", and a paragraph with text ""', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /news from the school/i})).toBeInTheDocument();
  expect(screen.getByText(/holberton school news goes here/i)).toBeInTheDocument()
});

describe('test HOC log mount and unmount "Login" and "CourseList" components', () => {

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    console.log.mockRestore();
  });
  
  test('logs when CourseList is mounted and unmounted based on "isLoggedIn" prop value, and handles nameless components', async () => {
    // const appRef = React.createRef();
  
    const { rerender, unmount, container } = render(<App />);
  
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
  
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: 'OK' });
  
    fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
    expect(submitButton).not.toBeDisabled();
  
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText(/course list/i)).toBeInTheDocument();
  
      const logoutSection = container.querySelector("div#logoutSection");
      expect(within(logoutSection).getByText('email@example.com')).toBeInTheDocument();
      expect(within(logoutSection).getByText(/logout/i)).toBeInTheDocument();
    });
  
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component CourseList is mounted|Component Component is mounted/));
  
    rerender();
  
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component CourseList is mounted|Component Component is mounted/));
  
    unmount();
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component CourseList is going to unmount/));
  
    const logCalls = console.log.mock.calls;
  
    expect(logCalls.filter(call => call[0].includes('Component CourseList is mounted') || call[0].includes('Component Component is mounted')).length).toBeGreaterThanOrEqual(1);
    expect(logCalls.filter(call => call[0].includes('Component CourseList is going to unmount') || call[0].includes('Component Component is going to unmount')).length).toBe(1);
  });
  
  test('logs when Login is mounted and unmounted based on "isLoggedIn" prop value, and handles nameless components', () => {
    const { unmount } = render(<App />);
  
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component (Login|Component) is mounted/));
  
    render(<App />);
  
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component (Login|Component) is mounted/));
  
    unmount();
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Component (Login|Component) is going to unmount/));
  
    const logCalls = console.log.mock.calls;
  
    expect(logCalls.filter(call => call[0].includes('Component Login is mounted') || call[0].includes('Component Component is mounted')).length).toBe(2);
    expect(logCalls.filter(call => call[0].includes('Component Login is going to unmount') || call[0].includes('Component Component is going to unmount')).length).toBe(1);
  });
})

// =============== CONTEXT =============== //
// =============== TESTING STATE =============== //
test('should display CourseList and welcome message after successful login and hide them after logout', async () => {
  const appRef = React.createRef();

  const { container } = render(<App ref={appRef} />);

  expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(submitButton).not.toBeDisabled();

  act(() => {
    fireEvent.click(submitButton);
  });

  await waitFor(() => {
    expect(screen.getByText(/course list/i)).toBeInTheDocument();

    const logoutSection = container.querySelector("div#logoutSection");
    expect(within(logoutSection).getByText('email@example.com')).toBeInTheDocument();
    expect(within(logoutSection).getByText(/logout/i)).toBeInTheDocument();
  });

  if (appRef.current) {
    act(() => {
      appRef.current.logOut();
    })
  }

  await waitFor(() => {
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/welcome email@example.com/i)).not.toBeInTheDocument();
  });
});

test('should call logIn method with a valid email and password with 8+', () => {
  const appRef = React.createRef();
  render(<App ref={appRef} />);

  act(() => {
    appRef.current.logIn('email@example.com', 'password123');
  });

  expect(appRef.current.state.user).toEqual({
    email: 'email@example.com',
    password: 'password123',
    isLoggedIn: true,
  });
});

test('should render login page when the user is not logged in and update state on login', () => {
  const mockedContextUser = {
    email: '',
    password: '',
    isLoggedIn: false,
  };

  const appRef = React.createRef();

  const { container } = render(
    <newContext.Provider value={{ user: { ...mockedContextUser }, logOut: jest.fn() }}>
      <App ref={appRef} />
    </newContext.Provider>
  );

  expect(screen.getByText('Log in to continue')).toBeInTheDocument();

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  fireEvent.click(submitButton);

  expect(screen.getByText(/course list/i)).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();

  const logoutSection = container.querySelector('div#logoutSection');
  expect(within(logoutSection).getByText('email@example.com')).toBeInTheDocument();
  expect(within(logoutSection).getByText(/logout/i)).toBeInTheDocument();

  if (appRef.current) {
    expect(appRef.current.state.user.email).toBe('email@example.com');
    expect(appRef.current.state.user.password).toBe('12345678');
    expect(appRef.current.state.user.isLoggedIn).toBe(true);
  }
});

// ========== TESTING LOGIN & LOGOUT ==========
test('logIn updates user state and renders CourseList', () => {
  render(<App />);

  expect(screen.getByText(/log in to continue/i)).toBeInTheDocument();

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: 'OK' });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  expect(screen.getByText(/course list/i)).toBeInTheDocument();
});

test('logOut clears user state and renders Login form', async () => {
  const appRef = React.createRef();
  render(<App ref={appRef} />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: 'OK' });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/course list/i)).toBeInTheDocument();

  act(() => {
    fireEvent.click(submitButton);
  });

  if (appRef.current) {
    act(() => {
      appRef.current.logOut();
    })
  }

  await waitFor(() => {
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/welcome email@example.com/i)).not.toBeInTheDocument();
  });
});
