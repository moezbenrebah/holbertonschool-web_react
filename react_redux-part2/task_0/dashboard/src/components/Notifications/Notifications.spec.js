import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Notifications from './Notifications';
import notificationsSlice from '../../features/notifications/notificationsSlice';


describe('Notifications', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );
    expect(screen.getByText('Your notifications')).toBeInTheDocument();
  });

  test('toggles drawer visibility when clicking the title', () => {
    const { container } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notificationsDrawer = container.querySelector('.Notifications');
    expect(notificationsDrawer).toHaveClass('visible');

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(notificationsDrawer).not.toHaveClass('visible');

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(notificationsDrawer).toHaveClass('visible');
  });

  test('close drawer on close button', () => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
      preloadedState: {
        notifications: {
          notifications: [
            { "id": 1, "type": "default", "value": "New course available" },
            { "id": 2, "type": "urgent", "value": "New resume available" },
            { "id": 3, "type": "urgent", "html": { __html: '<strong>Urgent requirement</strong> - complete by EOD' } }
          ],
          displayDrawer: true,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notificationsDrawer = container.querySelector('.Notifications');
    fireEvent.click(screen.getByAltText('close icon'));
    expect(notificationsDrawer).not.toHaveClass('visible');
  });

  test('marks notification as read', () => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
      preloadedState: {
        notifications: {
          notifications: [
            { "id": 1, "type": "default", "value": "New course available" },
            { "id": 2, "type": "urgent", "value": "New resume available" },
            { "id": 3, "type": "urgent", "html": { __html: '<strong>Urgent requirement</strong> - complete by EOD' } }
          ],
          displayDrawer: true,
        },
      },
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    fireEvent.click(screen.getByText('New course available'));

    const state = store.getState().notifications;

    expect(state.notifications).toEqual([
      { "id": 2, "type": "urgent", "value": "New resume available" },
      { "id": 3, "type": "urgent", "html": { __html: '<strong>Urgent requirement</strong> - complete by EOD' } }
    ]);
  });

  test('displays "No new notifications" when there are no notifications', () => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
      preloadedState: {
        notifications: {
          notifications: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText('No new notifications for now')).toBeInTheDocument();
  });

  test('renders notifications with HTML content safely', () => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
      preloadedState: {
        notifications: {
          notifications: [
            { id: 3, type: 'urgent', html: { __html: '<strong>Urgent requirement</strong> - complete by EOD' } },
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notificationItem = screen.getByRole('listitem');
    expect(notificationItem.innerHTML).toContain('<strong>Urgent requirement</strong> - complete by EOD');
  });

  test('does not re-render when notifications have not changed', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    consoleSpy.mockImplementation(() => {});

    const notifications = [
      { id: 1, type: 'default', value: 'New course available' },
    ];

    store = configureStore({
      reducer: {
        notifications: notificationsSlice,
      },
      preloadedState: {
        notifications: {
          notifications,
        },
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    store.dispatch({ type: 'dummy' });
    rerender(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});


// import { act, render, screen, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import Notifications from './Notifications';
// import { getLatestNotification } from '../../utils/utils';
// import notificationsSlice, { fetchNotifications, hideDrawer, markNotificationAsRead, showDrawer } from '../../features/notifications/notificationsSlice';


// describe('Notifications', () => {
//   let store;
//   let axiosMock;

//   beforeEach(() => {
//     store = configureStore({
//       reducer: {
//         notifications: notificationsSlice
//       },
//     });

//     axiosMock = new MockAdapter(axios);

//     axiosMock
//       .onGet('http://localhost:5173/notifications.json')
//       .reply(200, {
//         notifications: [
//           { id: 1, type: 'default', value: 'New course available' },
//           { id: 2, type: 'urgent', value: 'New resume available' },
//           { id: 3, type: 'urgent', html: { __html: '' } },
//         ],
//       });
//   });

//   afterEach(() => {
//     axiosMock.restore();
//   });

//   const renderWithStore = () => {
//       return render(
//         <Provider store={store}>
//           <Notifications />
//         </Provider>
//       );
//     };

//   test('renders without crashing', () => {
//     renderWithStore();

//     expect(screen.getByText('Your notifications')).toBeInTheDocument();
//   });

//   test('opens drawer on click', async() => {
//     let state = store.getState().notifications;
//     expect(state.displayDrawer).toBe(true);

//     act(() => store.dispatch(hideDrawer()));
    
//     await waitFor(() => {
//       state = store.getState().notifications;
//       expect(state.displayDrawer).toBe(false);
//     });

//     act(() => store.dispatch(showDrawer()));
    
//     await waitFor(() => {
//       state = store.getState().notifications;
//       expect(state.displayDrawer).toBe(true);
//     });
//   });

//   test('close drawer on close button', async () => {
//     act(() => store.dispatch(hideDrawer()));

//     renderWithStore();

//     const state = store.getState().notifications;
//     await waitFor(() => {
//       expect(state.displayDrawer).toBe(false);
//     })
//   });

//   test('marks notification as read', async () => {
//     await act(async () => {
//       await store.dispatch(fetchNotifications.fulfilled([
//         { id: 1, type: 'default', value: 'New course available' },
//         { id: 2, type: 'urgent', value: 'New resume available' },
//         { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
//       ]));
//     });

//     act(() => store.dispatch(markNotificationAsRead(1)));
//     renderWithStore();

//     await waitFor(() => {
//       expect(store.getState().notifications.notifications).toEqual([
//         { id: 2, type: 'urgent', value: 'New resume available' },
//         { id: 3, type: 'urgent', html: { __html: getLatestNotification() } }
//       ]);
//     });
//   });
// });
