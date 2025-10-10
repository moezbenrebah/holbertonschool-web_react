import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import Notifications from './Notifications';
import notificationsSlice, { fetchNotifications } from '../../features/notifications/notificationsSlice';


describe('Notifications', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('renders without crashing', async () => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
  });

  test('toggles drawer visibility when clicking the title', async() => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    // Find the drawer container (has the ref, not the menuItem)
    const notificationsDrawer = screen.getByText('Here is the list of notifications').closest('div');

    // Initially visible (no 'visible' class applied)
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();

    // Toggle drawer off
    fireEvent.click(screen.getByText(/your notifications/i));

    // Toggle drawer back on
    fireEvent.click(screen.getByText(/your notifications/i));

    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
  });

  test('close drawer on close button', async () => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText('New course available')).toBeInTheDocument();

    // Click close button
    fireEvent.click(screen.getByAltText('close icon'));
  });

  test('marks notification as read', async () => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const firstNotification = screen.getByText('New course available');

    fireEvent.click(firstNotification);

    await waitFor(() => {
      const updatedNotifications = screen.getAllByRole('listitem');
      expect(updatedNotifications).toHaveLength(2);
    });
  });

  test('renders with displayDrawer true', async () => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
  });

  test('does not re-render when drawer visibility is toggled', async () => {
    const promise = store.dispatch(fetchNotifications());

    mockAxios.mockResponse({
      data: {
        notifications: [
          { id: 1, type: 'default', value: 'New course available' },
          { id: 2, type: 'urgent', value: 'New resume available' },
          { id: 3, type: 'urgent', value: 'Placeholder' },
        ],
      },
    });

    await promise;

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    // Initially visible
    expect(screen.getByText('New course available')).toBeInTheDocument();

    // Toggle drawer off
    fireEvent.click(screen.getByText(/your notifications/i));

    // Toggle drawer back on
    fireEvent.click(screen.getByText(/your notifications/i));
    expect(screen.getByText('New course available')).toBeInTheDocument();
  });
});
