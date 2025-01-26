import { act, render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Notifications from './Notifications';
import notificationsSlice, { fetchNotifications } from '../../features/notifications/notificationsSlice';


describe('Notifications', () => {
  let store;
  let mockAxios;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
    });
    mockAxios = new MockAdapter(axios);
  });

  test('renders without crashing', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, [
      { 
        id: 1, 
        context: {
          type: 'default', 
          isRead: false,
          value: 'New course available'
        }
      },
      { 
        id: 2, 
        context: {
          type: 'urgent', 
          isRead: false,
          value: 'New resume available'
        }
      }
    ]);

    await store.dispatch(fetchNotifications());

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('New course available')).toBeInTheDocument();
  });

  test('toggles drawer visibility when clicking the title', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, [
      { 
        id: 1, 
        context: {
          type: 'default', 
          isRead: false,
          value: 'New course available'
        }
      }
    ]);

    await store.dispatch(fetchNotifications());

    const { container } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notificationsDrawer = container.querySelector('.Notifications');

    expect(notificationsDrawer).toHaveClass('visible');
    
    fireEvent.click(screen.getByText(/your notifications/i));
    expect(notificationsDrawer).not.toHaveClass('visible');
  });

  test('close drawer on close button', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, [
      { 
        id: 1, 
        context: {
          type: 'default', 
          isRead: false,
          value: 'New course available'
        }
      }
    ]);

    await store.dispatch(fetchNotifications());

    const { container } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(container.querySelector('.Notifications')).not.toHaveClass('visible');
  });

  test('marks notification as read', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, [
      { 
        id: 1, 
        context: {
          type: 'default', 
          isRead: false,
          value: 'New course available'
        }
      }
    ]);

    await store.dispatch(fetchNotifications());

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    fireEvent.click(screen.getByRole('listitem'));

    const state = store.getState().notifications;
    expect(state.notifications).toHaveLength(0);
  });

  test('displays "No new notifications" when there are no notifications', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(500, {
      message: 'Internal Server Error',
    });

    await store.dispatch(fetchNotifications());

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText('No new notifications for now')).toBeInTheDocument();
  });

  test('does not re-render when drawer visibility is toggled', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    });
  
    await store.dispatch(fetchNotifications());

    let renderCount = 0;
    const MemoizedNotifications = Notifications;
    const OriginalNotifications = MemoizedNotifications.type;

    MemoizedNotifications.type = function MockNotifications(props) {
      renderCount++;
      return OriginalNotifications(props);
    };
  
    const { container } = render(
      <Provider store={store}>
        <MemoizedNotifications />
      </Provider>
    );

    expect(renderCount).toBe(1);

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(container.querySelector('.Notifications')).not.toHaveClass('visible');

    expect(renderCount).toBe(1);

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(container.querySelector('.Notifications')).toHaveClass('visible');

    expect(renderCount).toBe(1);
  });

  test('displays loading indicator with fake timers', async () => {
    jest.useFakeTimers();

    mockAxios.onGet('http://localhost:5173/notifications.json').reply(() => 
      new Promise(resolve => {
        setTimeout(() => resolve([200, { notifications: [] }]), 1000);
      })
    );

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    act(() => {
      store.dispatch(fetchNotifications());
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
