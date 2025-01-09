import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from './features/auth/authSlice';
import { fetchNotifications } from './features/notifications/notificationsSlice';
import { fetchCourses } from './features/courses/coursesSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import CourseList from './pages/CourseList/CourseList';
import Notifications from './components/Notifications/Notifications';
import BodySection from './components/BodySection/BodySection';
import BodySectionWithMarginBottom from './components/BodySection/BodySectionWithMarginBottom';

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCourses());
    }
  }, [isLoggedIn, dispatch]);

  const handleLogin = (email, password) => {
    dispatch(login({ email, password }));
  };

  return (
    <div>
      <Notifications />
      <Header />
      {isLoggedIn ? (
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
}
