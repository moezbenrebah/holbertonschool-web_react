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
      ],
    };

    const action = markNotificationAsRead('5debd764507712e7a1307303');
    const expectedState = {
      ...stateWithNotifications,
      notifications: [
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
      ],
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
      const mockApiResponse = [
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
      ];

      const axiosMock = new MockAdapter(axios);

      axiosMock.onGet('http://localhost:5173/notifications.json')
      .reply(200, mockApiResponse);
    
      const dispatch = jest.fn();
      const getState = jest.fn();
      
      await fetchNotifications()(dispatch, getState, null);

      expect(dispatch).toHaveBeenCalledTimes(2);
      
      const fulfilledAction = dispatch.mock.calls[1][0];

      const expectedNotifications = mockApiResponse
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
