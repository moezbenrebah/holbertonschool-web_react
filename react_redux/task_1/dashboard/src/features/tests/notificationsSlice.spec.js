import {
  markNotificationAsRead,
  showDrawer,
  hideDrawer,
  fetchNotifications,
} from './src/features/notifications/notificationsSlice';
import notificationsSlice from './src/features/notifications/notificationsSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('notificationsSlice', () => {
  const initialState = {
    notifications: [],
    displayDrawer: true,
  };

  test('should return the initial state', () => {
    expect(notificationsSlice(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('should handle markNotificationAsRead', () => {
    const stateWithNotifications = {
      ...initialState,
      notifications: [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
      ],
    };
    const action = markNotificationAsRead(1);
    const expectedState = {
      ...stateWithNotifications,
      notifications: [{ id: 2, message: 'Notification 2' }],
    };
    expect(notificationsSlice(stateWithNotifications, action)).toEqual(
      expectedState
    );
  });

  test('should handle showDrawer', () => {
    const action = showDrawer();
    const expectedState = {
      ...initialState,
      displayDrawer: true,
    };
    expect(notificationsSlice(initialState, action)).toEqual(expectedState);
  });

  test('should handle hideDrawer', () => {
    const stateWithDrawerClosed = {
      ...initialState,
      displayDrawer: false,
    };
    const action = hideDrawer();
    expect(notificationsSlice(initialState, action)).toEqual(
      stateWithDrawerClosed
    );
  });

  describe('fetchNotifications async thunk', () => {
    test('should handle fetchNotifications.pending', () => {
      const action = { type: fetchNotifications.pending.type };
      const state = notificationsSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });

    test('should handle fetchNotifications.rejected', () => {
      const action = {
        type: fetchNotifications.rejected.type,
      };
      const state = notificationsSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });

    test('should handle fetchNotifications.rejected when base URL or port is incorrect', async () => {
      const incorrectBaseURL = 'http://loclhost:5173'; // Typo in "localhost"
      mock.onGet(`${incorrectBaseURL}/notifications.json`).networkError();

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchNotifications()(dispatch, getState, null);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchNotifications.rejected.type,
        })
      );
    });

    test('should handle fetchNotifications.rejected when endpoint is incorrect', async () => {
      const incorrectEndpoint = 'http://localhost:5173/notifictions.json'; // Typo in "notifications"
      mock.onGet(incorrectEndpoint).reply(404);

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchNotifications()(dispatch, getState, null);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchNotifications.rejected.type,
        })
      );
    });

    test('should handle fetchNotifications.fulfilled when API request is successful', async () => {
      const notifications = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
        { html: { __html: '<strong>Urgent requirement</strong> - complete by EOD' }, id: 3, type: 'urgent' },
      ];
      mock.onGet('http://localhost:5173/notifications.json').reply(200, {
        notifications,
      });
    
      const dispatch = jest.fn();
      const getState = jest.fn();
    
      await fetchNotifications()(dispatch, getState, null);

      
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchNotifications.fulfilled.type,
          payload: notifications,
        })
      );
    });
  })
});