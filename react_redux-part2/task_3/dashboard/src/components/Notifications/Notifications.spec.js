import { act, render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Notifications from './Notifications';
import notificationsSlice, { fetchNotifications } from '../../features/notifications/notificationsSlice';


describe('Notifications', () => {
  let store;
  let axiosMock;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        notifications: notificationsSlice
      },
    });

    axiosMock = new MockAdapter(axios);

    // Mock courses & notifications API
    axiosMock
      .onGet('http://localhost:5173/courses.json')
      .reply(200, {
        courses: [
          { id: 1, name: 'ES6', credit: 60 },
          { id: 2, name: 'Webpack', credit: 20 },
          { id: 3, name: 'React', credit: 40 },
        ],
      });

    axiosMock
      .onGet('http://localhost:5173/notifications.json')
      .reply(200, [
          { 
            id: '5debd764507712e7a1307303',
            context: {
              type: 'urgent',
              isRead: false,
              value: 'ut labore et dolore magna aliqua. Dignissim convallis aenean et tortor at risus viverra adipiscing. Ac tortor dignissim convallis aenean et.'
            }
          },
          { 
            id: '5debd76444dd4dafea89d53b',
            context: {
              type: 'urgent',
              isRead: false,
              value: 'Non diam phasellus vestibulum lorem sed risus ultricies. Tellus mauris a diam maecenas sed'
            }
          },
          { 
            id: '5debd7644e561e022d66e61a',
            context: {
              type: 'urgent',
              isRead: false,
              value: 'In hendrerit gravida rutrum quisque non tellus orci. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Lorem mollis aliquam ut porttitor'
            }
          },
          { 
            id: '5debd7644aaed86c97bf9d5e',
            context: {
              type: 'default',
              isRead: false,
              value: 'Cursus metus aliquam eleifend mi in nulla posuere.'
            }
          },
          { 
            id: '5debd76413f0d5e5429c28a0',
            context: {
              type: 'default',
              isRead: false,
              value: 'Quam viverra orci sagittis eu volutpat odio facilisis mauris sit'
            }
          },
          { 
            id: '5debd764c1127bc5a490a4d0',
            context: {
              type: 'default',
              isRead: false,
              value: 'Cursus risus at ultrices mi.'
            }
          },
          { 
            id: '5debd764a4f11eabef05a81d',
            context: {
              type: 'default',
              isRead: false,
              value: 'Ac placerat vestibulum lectus mauris ultrices eros in cursus. Amet nisl suscipit adipiscing bibendum est ultricies integer. Lorem donec massa sapien faucibus et molestie ac'
            }
          },
          { 
            id: '5debd764af0fdd1fc815ad9b',
            context: {
              type: 'urgent',
              isRead: false,
              value: 'Nulla malesuada pellentesque elit eget gravida cum sociis'
            }
          },
          { 
            id: '5debd76468cb5b277fd125f4',
            context: {
              type: 'urgent',
              isRead: false,
              value: 'Elit eget gravida cum sociis natoque penatibus et. Congue mauris rhoncus aenean vel'
            }
          },
          { 
            id: '5debd764de9fa684468cdc0b',
            context: {
              type: 'default',
              isRead: false,
              value: 'Leo vel fringilla est ullamcorper. Volutpat consequat mauris nunc congue'
            }
          }
        ]);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  test('renders without crashing', async () => {
    await act(async () => {
      await store.dispatch(fetchNotifications());
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByText(/ut labore et dolore magna aliqua/i)).toBeInTheDocument();
  });

  test('toggles drawer visibility when clicking the title', async () => {

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
    await act(async () => {
      await store.dispatch(fetchNotifications());
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const notifications = screen.getAllByRole('listitem');
    fireEvent.click(notifications[0]);

    const state = store.getState().notifications;
    expect(state.notifications).toHaveLength(9);
  });

  test('displays "No new notifications" when there are no notifications', async () => {
    // override the above mock with empty response
    axiosMock.onGet('http://localhost:5173/notifications.json').reply(200, []);

    await act(async () => {
      await store.dispatch(fetchNotifications());
    });

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument();
  });

  test('does not re-render when drawer visibility is toggled', async () => {
  
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

    axiosMock.onGet('http://localhost:5173/notifications.json').reply(() => 
      new Promise(resolve => {
        setTimeout(() => resolve([200, []]), 1000);
      })
    );

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    act(() => {
      store.dispatch(fetchNotifications());
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      await jest.runAllTimersAsync();
    });
  });

  // filtering
  describe('Notification filtering', () => {
    test('toggles urgent filter correctly', async () => {
      await act(async () => {
        await store.dispatch(fetchNotifications());
      });
  
      const { container } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(10);

      const urgentButton = screen.getByText('‼️');

      fireEvent.click(urgentButton);
      expect(screen.getAllByRole('listitem')).toHaveLength(5);

      fireEvent.click(urgentButton);
      expect(screen.getAllByRole('listitem')).toHaveLength(10);
    });
  
    test('toggles default filter correctly', async () => {
      await act(async () => {
        await store.dispatch(fetchNotifications());
      });
  
      const { container } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(10);

      const defaultButton = screen.getByText('?');

      fireEvent.click(defaultButton);
      expect(screen.getAllByRole('listitem')).toHaveLength(5);
      
      fireEvent.click(defaultButton);
      expect(screen.getAllByRole('listitem')).toHaveLength(10);
    });
  });
});

