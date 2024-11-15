import { useState, useEffect, useCallback } from 'react';
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