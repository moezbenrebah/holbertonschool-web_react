import React, { useCallback, useState } from 'react';
import { act, render, fireEvent, renderHook,screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { newContext } from '../Context/context';
import App from './App';


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

test('should confirm App is a function component', () => {
  expect(Object.keys(App.prototype)).toHaveLength(0);
  expect(Object.getPrototypeOf(App)).not.toBe(React.Component);
  expect(typeof App).toBe('function');
  expect(App.prototype?.render).toBe(undefined);
});

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
test('should display CourseList and welcome message after login and hide them after logout', async () => {
  // Initial render of the App component
  render(<App />);

  // Verify initial state shows login form
  expect(screen.getByText('Log in to continue')).toBeInTheDocument();

  // Get form elements
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  // Perform login
  await act(async () => {
    await userEvent.type(emailInput, 'email@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
  });

  // Verify successful login shows course list
  expect(screen.getByText('Course list')).toBeInTheDocument();

  // Get and click the logout link that appears after login
  const logoutLink = screen.getByText('(logout)');
  await act(async () => {
    await userEvent.click(logoutLink);
  });

  // Verify the user is logged out and UI is updated
  await waitFor(() => {
    // Check that we're back to login state
    expect(screen.getByText('Log in to continue')).toBeInTheDocument();
    // Verify course list is no longer shown
    expect(screen.queryByText('Course list')).not.toBeInTheDocument();
    // Verify welcome message is gone
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });
});

test('should handle login with valid email and password', async () => {
  render(<App />);

  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);
  });

  expect(screen.getByText('Course list')).toBeInTheDocument();
  expect(screen.queryByText('Log in to continue')).not.toBeInTheDocument();

  const logoutSection = document.querySelector('#logoutSection');
  expect(logoutSection).toBeInTheDocument();
  expect(logoutSection).toHaveTextContent('email@example.com');
});

// ========== TESTING LOGIN & LOGOUT ==========

test('should render login page when the user is not logged in and handle login flow correctly', async () => {
  const mockedContextUser = {
    email: '',
    password: '',
    isLoggedIn: false,
  };

  const { container } = render(
    <newContext.Provider value={{ user: { ...mockedContextUser }, logOut: jest.fn() }}>
      <App />
    </newContext.Provider>
  );

  expect(screen.getByText('Log in to continue')).toBeInTheDocument();

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    fireEvent.click(submitButton);
  });

  expect(screen.getByText(/course list/i)).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();

  const logoutSection = container.querySelector('div#logoutSection');
  expect(within(logoutSection).getByText('email@example.com')).toBeInTheDocument();
  expect(within(logoutSection).getByText(/logout/i)).toBeInTheDocument();

  const logoutButton = within(logoutSection).getByText(/logout/i);
  
  await act(async () => {
    fireEvent.click(logoutButton);
  });

  expect(screen.getByText('Log in to continue')).toBeInTheDocument();
});

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

test('logOut function should clears user state and renders Login form', async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /ok/i });

  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  expect(screen.getByText('Course list')).toBeInTheDocument();
  
  const logoutSection = container.querySelector('#logoutSection');
  const logoutLink = logoutSection.querySelector('a');
  
  await user.click(logoutLink);

  await waitFor(() => {
    expect(container.querySelector('#logoutSection')).not.toBeInTheDocument();
    expect(screen.queryByText('Course list')).not.toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();

    const loginTitle = screen.getByText('Log in to continue');
    expect(loginTitle).toBeInTheDocument();
  });
});

test('verify notification item deletion', async () => {
  const user = userEvent.setup();
  render(<App />);

  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(3);
  
  expect(screen.getByText((content, element) => {
    const hasText = element => element.textContent === 'Urgent requirement - complete by EOD';
    const nodeHasText = hasText(element);
    const childrenDontHaveText = Array.from(element.children).every(
      child => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  })).toBeInTheDocument();

  await user.click(screen.getByText('New course available'));

  await waitFor(() => {
    expect(screen.queryByText('New course available')).not.toBeInTheDocument();

    expect(screen.getByText('New resume available')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.textContent === 'Urgent requirement - complete by EOD';
    })).toBeInTheDocument();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

test('verify notification item deletion', async () => {
  const consoleSpy = jest.spyOn(console, 'log')
  
  render(<App />);

  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(3);

  expect(listItems[0].textContent).toEqual('New course available');
  expect(listItems[0]).toBeInTheDocument();

  expect(listItems[1].textContent).toEqual('New resume available');
  expect(listItems[1]).toBeInTheDocument();

  expect(listItems[2].textContent).toEqual('Urgent requirement - complete by EOD');
  expect(listItems[2]).toBeInTheDocument();

  await userEvent.click(screen.getByText('New course available'))

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');
  
})

test('No errors on browser console', () => {
  const mockedContextUser = {
    email: '',
    password: '',
    isLoggedIn: false,
  };

  render(
    <newContext.Provider value={{ user: { ...mockedContextUser }, logOut: jest.fn() }}>
      <App />
    </newContext.Provider>
  );

  const consoleSpyError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleSpyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  expect(consoleSpyError).not.toHaveBeenCalled();
  expect(consoleSpyWarn).not.toHaveBeenCalled();
})


// ========== TEST useState HOOK ==========

describe('App Component State Management', () => {
  const renderAppWithContext = (initialContextValue = {}) => {
    const defaultContext = {
      user: {
        email: '',
        password: '',
        isLoggedIn: false
      },
      logOut: jest.fn()
    };

    return render(
      <newContext.Provider value={{ ...defaultContext, ...initialContextValue }}>
        <App />
      </newContext.Provider>
    );
  };

  describe('DisplayDrawer State Tests', () => {
    test('displayDrawer state management and notification visibility', async () => {
      const user = userEvent.setup();
      renderAppWithContext();

      // Initial state check
      const notificationsList = screen.getByText('Here is the list of notifications');
      expect(notificationsList).toBeVisible();

      // Find and click close button
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      
      // Wait for state update and check visibility
      await waitFor(() => {
        const hiddenList = screen.queryByText('Here is the list of notifications');
        expect(hiddenList).toBeNull();
      });

      // Test show drawer
      const notificationTitle = screen.getByText('Your notifications');
      await user.click(notificationTitle);

      // Verify drawer is visible again
      await waitFor(() => {
        const visibleList = screen.getByText('Here is the list of notifications');
        expect(visibleList).toBeVisible();
      });
    });

    test('displayDrawer keyboard interactions', async () => {
      const user = userEvent.setup();
      renderAppWithContext();
  
      // Initial state check
      const notificationsList = screen.getByText('Here is the list of notifications');
      expect(notificationsList).toBeVisible();
  
      // Find and click close button first to ensure proper state
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      
      // Wait for state update and check visibility
      await waitFor(() => {
        const hiddenList = screen.queryByText('Here is the list of notifications');
        expect(hiddenList).toBeNull();
      }, { timeout: 2000 });
    });
  });

  describe('User State Tests', () => {
    test('user state management through login/logout cycle', async () => {
      const user = userEvent.setup();
      const mockLogOut = jest.fn();

      const { container } = render(
        <newContext.Provider value={{ user: { isLoggedIn: false }, logOut: mockLogOut }}>
          <App />
        </newContext.Provider>
      );

      expect(screen.getByRole('heading', { name: 'Log in to continue' })).toBeInTheDocument();
      expect(screen.queryByText('Course list')).not.toBeInTheDocument();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /ok/i });
  
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      expect(screen.getByText('Course list')).toBeInTheDocument();
      expect(screen.queryByText('Log in to continue')).not.toBeInTheDocument();
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  
      const logoutSection = container.querySelector('div#logoutSection');
      const logoutButton = within(logoutSection).getByText(/logout/i);
  
      await act(async () => {
        fireEvent.click(logoutButton);
      });
  
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /log in to continue/i })).toBeInTheDocument();
        expect(screen.queryByText(/course list/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Notifications State Tests', () => {
    test('notifications state management and interactions', async () => {
      const user = userEvent.setup();
      const { container } = renderAppWithContext();

      expect(screen.getByText('New course available')).toBeInTheDocument();
      expect(screen.getByText('New resume available')).toBeInTheDocument();
      expect(screen.getByText('Urgent requirement')).toBeInTheDocument();

      const firstNotification = screen.getByText('New course available');
      await user.click(firstNotification);

      expect(screen.queryByText('New course available')).not.toBeInTheDocument();
    });

    test('notifications priority and ordering', () => {
      renderAppWithContext();

      const notifications = screen.getAllByRole('listitem');

      const urgentNotifications = notifications.filter(notification => 
        window.getComputedStyle(notification).color === 'red'
      );
      
      expect(urgentNotifications.length).toBeGreaterThan(0);
      expect(notifications[1]).toBe(urgentNotifications[0]);
    });
  });
});


describe('App Component Hooks', () => {
  describe('handleDisplayDrawer', () => {
    test('should toggle display state to true', () => {
      const { result } = renderHook(() => {
        const [displayDrawer, setDisplayDrawer] = useState(false);
        const handleDisplayDrawer = useCallback(() => {
          setDisplayDrawer(true);
        }, []);
        return { displayDrawer, handleDisplayDrawer };
      });

      act(() => {
        result.current.handleDisplayDrawer();
      });

      expect(result.current.displayDrawer).toBe(true);
    });

    test('should maintain reference equality between renders', () => {
      const { result, rerender } = renderHook(() => {
        const [displayDrawer, setDisplayDrawer] = useState(false);
        const handleDisplayDrawer = useCallback(() => {
          setDisplayDrawer(true);
        }, []);
        return { handleDisplayDrawer };
      });

      const firstReference = result.current.handleDisplayDrawer;
      rerender();

      expect(result.current.handleDisplayDrawer).toBe(firstReference);
    });
  });

  describe('handleHideDrawer', () => {
    it('should toggle display state to false', () => {
      const { result } = renderHook(() => {
        const [displayDrawer, setDisplayDrawer] = useState(true);
        const handleHideDrawer = useCallback(() => {
          setDisplayDrawer(false);
        }, []);
        return { displayDrawer, handleHideDrawer };
      });

      act(() => {
        result.current.handleHideDrawer();
      });

      expect(result.current.displayDrawer).toBe(false);
    });
  });

  describe('logOut', () => {
    test('should reset user state', () => {
      const { result } = renderHook(() => {
        const [user, setUser] = useState({
          email: 'test@test.com',
          password: 'password123',
          isLoggedIn: true
        });
        const logOut = useCallback(() => {
          setUser({
            email: '',
            password: '',
            isLoggedIn: false,
          });
        }, []);
        return { user, logOut };
      });

      act(() => {
        result.current.logOut();
      });

      expect(result.current.user).toEqual({
        email: '',
        password: '',
        isLoggedIn: false
      });
    });

    test('should maintain reference equality between renders', () => {
      const { result, rerender } = renderHook(() => {
        const [user, setUser] = useState({
          email: 'test@test.com',
          password: 'password123',
          isLoggedIn: true
        });
        const logOut = useCallback(() => {
          setUser({
            email: '',
            password: '',
            isLoggedIn: false,
          });
        }, []);
        return { logOut };
      });

      const firstReference = result.current.logOut;
      rerender();
      expect(result.current.logOut).toBe(firstReference);
    });
  });

  describe('markNotificationAsRead', () => {
    const mockNotifications = [
      { id: 1, type: 'default', value: 'Test 1' },
      { id: 2, type: 'urgent', value: 'Test 2' }
    ];

    test('should remove notification with specified id', () => {
      const { result } = renderHook(() => {
        const [notifications, setNotifications] = useState(mockNotifications);
        const markNotificationAsRead = useCallback((id) => {
          setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
          );
        }, []);
        return { notifications, markNotificationAsRead };
      });

      act(() => {
        result.current.markNotificationAsRead(1);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].id).toBe(2);
    });

    test('should maintain reference equality between renders', () => {
      const { result, rerender } = renderHook(() => {
        const [notifications, setNotifications] = useState(mockNotifications);
        const markNotificationAsRead = useCallback((id) => {
          setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
          );
        }, []);
        return { markNotificationAsRead };
      });

      const firstReference = result.current.markNotificationAsRead;
      rerender();
      expect(result.current.markNotificationAsRead).toBe(firstReference);
    });
  });
});

describe('App Component Type Tests', () => {
  test('should verify that App is a functional component', () => {
    // Helper function to determine component type
    function getComponentType(component) {
      if (typeof component !== 'function') {
        return
      }
      
      if (component.prototype?.isReactComponent) {
        return 'class component';
      }
      
      return 'functional component';
    }

    expect(typeof App).toBe('function');
      
    expect(App.prototype?.isReactComponent).toBeUndefined();

    const componentType = getComponentType(App);
    expect(componentType).toBe('functional component');

    expect(() => {
      const element = React.createElement(App);
      expect(React.isValidElement(element)).toBe(true);
    }).not.toThrow();
  });
});
