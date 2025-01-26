import notificationsSlice, {
  markNotificationAsRead,
  fetchNotifications,
} from '../notifications/notificationsSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('notificationsSlice', () => {
  const initialState = {
    notifications: [],
    loading: false
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

  describe('fetchNotifications async thunk', () => {
    test('should handle fetchNotifications.pending', () => {
      const action = { type: fetchNotifications.pending.type };
      const state = notificationsSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
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

     // typo in "localhost"
    test('should handle fetchNotifications.rejected when base URL or port is incorrect', async () => {
      const incorrectBaseURL = 'http://loclhost:5173';
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
      const incorrectEndpoint = 'http://localhost:5173/notifictions.json'; // typo in "notifications"
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
      const apiResponse = [
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
        }
      ];

      mock.onGet('http://localhost:5173/notifications.json').reply(200, apiResponse);
    
      const dispatch = jest.fn();
      const getState = jest.fn();
      
      await fetchNotifications()(dispatch, getState, null);

      expect(dispatch).toHaveBeenCalledTimes(2);
      
      const fulfilledAction = dispatch.mock.calls[1][0];

      const expectedNotifications = apiResponse
        .filter(n => !n.context.isRead)
        .map(({ id, context }) => ({
          id,
          type: context.type,
          isRead: context.isRead,
          value: context.value
        }));
    
      expect(fulfilledAction).toEqual(
        expect.objectContaining({
          type: fetchNotifications.fulfilled.type,
          payload: expectedNotifications
        })
      );
    });
  });
});
