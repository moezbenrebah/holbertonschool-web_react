import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Footer from './Footer';
import authSlice, { login } from '../../features/auth/authSlice';


describe('Footer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
  });

  test('displays "Contact us" link when logged in', () => {
    store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  test('does not display "Contact us" link when logged out', () => {
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument();
  });
});