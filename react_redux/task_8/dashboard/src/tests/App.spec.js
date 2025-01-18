import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authSlice from '../features/auth/authSlice';
import notificationsSlice from '../features/notifications/notificationsSlice';
import coursesSlice from '../features/courses/coursesSlice';
import { login } from '../features/auth/authSlice'

describe('App', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
        notifications: notificationsSlice,
        courses: coursesSlice,
      },
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('School Dashboard')).toBeInTheDocument();
  });

  test('displays Login when not logged in', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('Log in to continue')).toBeInTheDocument();
  });

  test('displays CourseList when logged in', () => {
    store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('Course list')).toBeInTheDocument();
  });
});