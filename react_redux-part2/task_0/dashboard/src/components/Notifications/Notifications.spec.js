import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    });

    const notificationsResponse = await axios.get('http://localhost:5173/notifications.json');
    expect(notificationsResponse.data.notifications).toHaveLength(3);

    await store.dispatch(fetchNotifications());

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
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    });

    const notificationsResponse = await axios.get('http://localhost:5173/notifications.json');
    expect(notificationsResponse.data.notifications).toHaveLength(3);

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
    expect(screen.queryByRole('listitem', { name: 'New course available' })).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: 'New resume available' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(notificationsDrawer).toHaveClass('visible');
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
  });

  test('close drawer on close button', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    });

    const notificationsResponse = await axios.get('http://localhost:5173/notifications.json');
    expect(notificationsResponse.data.notifications).toHaveLength(3);

    await store.dispatch(fetchNotifications());

    const { container } = render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notificationsDrawer = container.querySelector('.Notifications');
    fireEvent.click(screen.getByAltText('close icon'));
    expect(notificationsDrawer).not.toHaveClass('visible');
  });

  test('marks notification as read', async () => {
    mockAxios.onGet('http://localhost:5173/notifications.json').reply(200, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    });

    const notificationsResponse = await axios.get('http://localhost:5173/notifications.json');
    expect(notificationsResponse.data.notifications).toHaveLength(3);

    await store.dispatch(fetchNotifications());

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
