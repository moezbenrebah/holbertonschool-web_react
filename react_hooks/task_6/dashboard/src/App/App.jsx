import { useEffect, useCallback, useReducer } from 'react';
import './App.css';
import Notifications from '../Notifications/Notifications';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import CourseList from '../CourseList/CourseList';
import { getLatestNotification } from '../utils/utils';
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom';
import BodySection from '../BodySection/BodySection';
import appReducer, { APP_ACTIONS, initialState } from './AppReducer';


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

export default function App() {
  const [state, dispatch] = useReducer(appReducer, { ...initialState, notifications: notificationsList });

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === "h") {
        alert("Logging you out");
        dispatch({ type: APP_ACTIONS.LOGOUT });
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleDisplayDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER });
  }, []);

  const logIn = useCallback((email, password) => {
    dispatch({
      type: APP_ACTIONS.LOGIN,
      payload: { email, password }
    });
  }, []);

  const logOut = useCallback(() => {
    dispatch({ type: APP_ACTIONS.LOGOUT });
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    dispatch({
      type: APP_ACTIONS.MARK_NOTIFICATION_READ,
      payload: id
    });
    console.log(`Notification ${id} has been marked as read`);
  }, []);

  return (
    <>
      <Notifications
        notifications={state.notifications}
        handleDisplayDrawer={handleDisplayDrawer}
        handleHideDrawer={handleDisplayDrawer}
        displayDrawer={state.displayDrawer}
        markNotificationAsRead={markNotificationAsRead}
      />
      <>
        <Header 
          userEmail={state.user.email}
          isLoggedIn={state.user.isLoggedIn}
          logOut={logOut}
        />
        {!state.user.isLoggedIn ? (
          <BodySectionWithMarginBottom title='Log in to continue'>
            <Login
              login={logIn}
              email={state.user.email}
              password={state.user.password}
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
      <Footer isLoggedIn={state.user.isLoggedIn} />
    </>
  );
}
