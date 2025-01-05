import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './features/auth/authSlice';
import { fetchNotifications } from './features/notifications/notificationsSlice';
import { fetchCourses } from './features/courses/coursesSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import CourseList from './pages/CourseList/CourseList';
import Notifications from './components/Notifications/Notifications';
import BodySection from './components/BodySection/BodySection';
import BodySectionWithMarginBottom from './components/BodySection/BodySectionWithMarginBottom';

export default function App () {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(fetchCourses());
    }
  }, [user.isLoggedIn, dispatch]);

  const handleLogin = (email, password) => {
    dispatch(login({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Notifications />
      <Header />
      {user.isLoggedIn ? (
        <BodySectionWithMarginBottom title="Course list">
          <CourseList courses={courses} />
        </BodySectionWithMarginBottom>
      ) : (
        <BodySection title="Log in to continue">
          <Login login={handleLogin} />
        </BodySection>
      )}
      <Footer />
    </div>
  );
};
