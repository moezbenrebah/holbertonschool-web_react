# React Transition Plan: Class to Functional Components

### Task 1: Refactor Header Component

###### Current Features:

- Static contextType
- Context consumption
- Simple rendering logic

###### Instructions:

1- Convert class to function component
2- Replace static contextType with useContext
3- Maintain existing logout functionality

Header.jsx:
```
import React, { useContext } from 'react';
import './Header.css';
import logo from '../assets/holberton-logo.jpg';
import { newContext } from '../Context/context';

export default function Header() {
  const { user, logOut } = useContext(newContext);
  
  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="holberton logo" />
      <h1>School Dashboard</h1>
      {user.isLoggedIn && (
        <div id="logoutSection">
          Welcome <b>{user.email}</b> <a href="" onClick={logOut}>(logout)</a>
        </div>
      )}
    </div>
  );
}
```


### Task 2: Refactor Footer Component

Current Features:

- Context Consumer pattern
- Conditional rendering

###### Instructions:

1- Convert to functional component
2- Replace Context.Consumer with useContext
3- Maintain conditional rendering logic

Footer.jsx:
```
import React, { useContext } from 'react';
import './Footer.css';
import { getCurrentYear, getFooterCopy } from '../utils/utils';
import { newContext } from '../Context/context';

export default function Footer() {
  const { user } = useContext(newContext);
  
  if (!user) return null;
  
  return (
    <div className="App-footer">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
      {user.isLoggedIn && <a href="#">Contact us</a>}
    </div>
  );
}

```


#### Task 3: Refactor Login Component

###### Current Features:

- Form state management
- Input validation
- HOC wrapper
- Event handlers

###### Instructions:

1- Convert class to function
2- Replace state with useState
3- Convert handlers to hooks pattern
4- Maintain HOC functionality

```
import React, { useState, useEffect } from 'react';
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
```


#### Task 4: Refactor NotificationItem Component

###### Current Features:

- PureComponent optimization
- Conditional rendering
- Event handling

###### Instructions:

1- Convert PureComponent to function
2- Use React.memo for optimization
3- Maintain click handler functionality

```
import React, { memo } from 'react';

const NotificationItem = memo(function NotificationItem({ 
  type, 
  html, 
  value, 
  markAsRead, 
  id 
}) {
  if (type === 'default') {
    return (
      <li
        style={{ color: "blue" }}
        data-notification-type={type}
        onClick={() => markAsRead(id)}
      >
        {value}
      </li>
    );
  }
  
  if (type === 'urgent' && html !== undefined) {
    return (
      <li
        style={{ color: "red" }}
        data-notification-type={type}
        dangerouslySetInnerHTML={html}
        onClick={() => markAsRead(id)}
      />
    );
  }
  
  return (
    <li
      style={{ color: "red" }}
      data-notification-type={type}
      onClick={() => markAsRead(id)}
    >
      {value}
    </li>
  );
});

export default NotificationItem;
```


### Task 5: Refactor WithLogging HOC

##### Current Features:

- Lifecycle methods
- Component wrapping
- Logging functionality

##### Instructions:

1- Convert to function component
2- Use useEffect for lifecycle events
3- Maintain HOC pattern

```
import React, { useEffect } from 'react';

const WithLogging = (WrappedComponent) => {
  function WithLoggingComponent(props) {
    useEffect(() => {
      const componentName = WrappedComponent.name || 'Component';
      console.log(`Component ${componentName} is mounted`);
      
      return () => {
        console.log(`Component ${componentName} is going to unmount`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  }

  WithLoggingComponent.displayName = `WithLogging(${WrappedComponent.name || 'Component'})`;
  return WithLoggingComponent;
};

export default WithLogging;
```


### Task 6: Refactor Notifications Component

##### Current Features:

- PureComponent optimization
- Complex prop handling
- Conditional rendering

##### Instructions:

1- Convert PureComponent to function
2- Use React.memo for optimization
3- Maintain display logic

```
import React, { memo } from 'react';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';
import NotificationItem from './NotificationItem';

const Notifications = memo(function Notifications({
  displayDrawer,
  handleDisplayDrawer,
  handleHideDrawer,
  notifications,
  markNotificationAsRead
}) {
  return (
    <>
      <div className="notification-title" onClick={handleDisplayDrawer}>
        Your notifications
      </div>
      {displayDrawer && (
        <div className="Notifications">
          {notifications.length > 0 ? (
            <>
              <p>Here is the list of notifications</p>
              <button onClick={handleHideDrawer} aria-label="Close">
                <img src={closeIcon} alt="close icon" />
              </button>
              <ul>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    value={notification.value}
                    html={notification.html}
                    markAsRead={() => markNotificationAsRead(notification.id)}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p>No new notifications for now</p>
          )}
        </div>
      )}
    </>
  );
});

export default Notifications;
```


### Task 7: Refactor App Component

##### Current Features:

- Main state management
- Context Provider
- Lifecycle methods
- Event handlers
- Complex conditional rendering

##### Instructions:

1- Convert to function component
2- Use multiple useState hooks for state management
3- Replace lifecycle methods with useEffect
4- Maintain context provider setup
5- Convert event handlers to hook pattern

```
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Notifications from '../Notifications/Notifications';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import CourseList from '../CourseList/CourseList';
import { getLatestNotification } from '../utils/utils';
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom';
import BodySection from '../BodySection/BodySection';
import { newContext } from '../Context/context';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification() } }
];

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 }
];

function App() {
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [user, setUser] = useState({ ...newContext.user });
  const [notifications, setNotifications] = useState(notificationsList);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === "h") {
        alert("Logging you out");
        logOut();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true);
  }, []);

  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false);
  }, []);

  const logIn = useCallback((email, password) => {
    setUser({
      email,
      password,
      isLoggedIn: true
    });
  }, []);

  const logOut = useCallback(() => {
    setUser({
      email: '',
      password: '',
      isLoggedIn: false,
    });
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    console.log(`Notification ${id} has been marked as read`);
  }, []);

  return (
    <newContext.Provider value={{ user, logout: logOut }}>
      <Notifications
        notifications={notifications}
        handleHideDrawer={handleHideDrawer}
        handleDisplayDrawer={handleDisplayDrawer}
        displayDrawer={displayDrawer}
        markNotificationAsRead={markNotificationAsRead}
      />
      <>
        <Header />
        {!user.isLoggedIn ? (
          <BodySectionWithMarginBottom title='Log in to continue'>
            <Login
              login={logIn}
              email={user.email}
              password={user.password}
            />
          </BodySectionWithMarginBottom>
        ) : (
          <BodySectionWithMarginBottom title='Course list'>
            <CourseList courses={coursesList} />
          </BodySectionWithMarginBottom>
        )}
        <BodySection title="News from the School">
          <p>Holberton School news goes here</p>
        </BodySection>
      </>
      <Footer />
    </newContext.Provider>
  );
}

export default App;
```


### Task 8: Create useLogin Custom Hook

##### Purpose:

Create a reusable hook that handles login form logic, including:

- Form state management
- Validation
- Submission handling
- Reusable login functionality

##### Implementation
```
import { useState, useCallback } from 'react';

function useLogin({ initialEmail = '', initialPassword = '', onLogin }) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: initialPassword
  });

  const [enableSubmit, setEnableSubmit] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = useCallback((email, password) => {
    return validateEmail(email) && password.length >= 8;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      setEnableSubmit(validateForm(
        name === 'email' ? value : newData.email,
        name === 'password' ? value : newData.password
      ));
      return newData;
    });
  }, [validateForm]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (enableSubmit && onLogin) {
      onLogin(formData.email, formData.password);
    }
  }, [enableSubmit, formData, onLogin]);

  const reset = useCallback(() => {
    setFormData({
      email: initialEmail,
      password: initialPassword
    });
    setEnableSubmit(false);
  }, [initialEmail, initialPassword]);

  return {
    email: formData.email,
    password: formData.password,
    enableSubmit,
    handleChange,
    handleSubmit,
    reset
  };
}

// Updated Login Component
function Login({ login }) {
  const {
    email,
    password,
    enableSubmit,
    handleChange,
    handleSubmit
  } = useLogin({
    onLogin: login
  });

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
            value={email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
          />
          <input
            type="submit"
            value="OK"
            disabled={!enableSubmit}
          />
        </div>
      </div>
    </form>
  );
}
```


### Task 9: Implement State Management with useReducer

##### Purpose

Centralize notifications state management using useReducer to handle:

- UI state (notifications display/hide)
- Notifications mark items as read

##### Implementation

```
// 
import React, { useReducer } from 'react';
import NotificationItem from './NotificationItem';
import './Notifications.css';
import closeIcon from '../assets/close-icon.png';

// Action types
const NOTIFICATION_ACTIONS = {
  MARK_AS_READ: 'MARK_AS_READ',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER'
};

// Reducer
function notificationsReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case NOTIFICATION_ACTIONS.TOGGLE_DRAWER:
      return {
        ...state,
        displayDrawer: !state.displayDrawer
      };
      
    default:
      return state;
  }
}

function Notifications({ initialNotifications = [] }) {
  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: initialNotifications,
    displayDrawer: false
  });

  const handleDisplayDrawer = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.TOGGLE_DRAWER });
  };

  const markNotificationAsRead = (id) => {
    dispatch({ 
      type: NOTIFICATION_ACTIONS.MARK_AS_READ, 
      payload: id 
    });
    console.log(`Notification ${id} has been marked as read`);
  };

  return (
    <>
      <div className="notification-title" onClick={handleDisplayDrawer}>
        Your notifications
      </div>
      {state.displayDrawer && (
        <div className="Notifications">
          {state.notifications.length > 0 ? (
            <>
              <p>Here is the list of notifications</p>
              <button onClick={handleDisplayDrawer} aria-label="Close">
                <img src={closeIcon} alt="close icon" />
              </button>
              <ul>
                {state.notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    value={notification.value}
                    html={notification.html}
                    markAsRead={() => markNotificationAsRead(notification.id)}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p>No new notifications for now</p>
          )}
        </div>
      )}
    </>
  );
}

export default Notifications;
```




























