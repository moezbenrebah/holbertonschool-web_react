import { useState, useCallback } from 'react';
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

export default function App() {
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [user, setUser] = useState({ ...newContext.user });
  const [notifications, setNotifications] = useState(notificationsList);

  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true);
  }, []);

  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false);
  }, []);

  const logIn = (email, password) => {
    setUser({
      email,
      password,
      isLoggedIn: true
    });
  };

  const logOut = () => {
    setUser({
      email: '',
      password: '',
      isLoggedIn: false,
    });
  };

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    console.log(`Notification ${id} has been marked as read`);
  }, []);

  return (
    <newContext.Provider value={{ user, logOut }}>
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
