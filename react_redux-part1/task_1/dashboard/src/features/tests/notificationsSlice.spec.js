import notificationsSlice, {
  markNotificationAsRead,
  showDrawer,
  hideDrawer,
  fetchNotifications,
} from '../notifications/notificationsSlice';

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
  });
});
