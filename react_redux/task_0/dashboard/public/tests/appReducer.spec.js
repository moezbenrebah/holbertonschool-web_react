import { appReducer, APP_ACTIONS, initialState } from '../../src/appReducer';

describe('test appReducer', () => {
  describe('basic reducer behavior', () => {
    test('should return initial state when no state is provided', () => {
			
      const newState = appReducer(undefined, { type: 'INITIAL' });
      console.log(`STATE===> ${newState}`)
      expect(newState).toEqual(initialState);
    });

    test('should return current state for unknown action types', () => {
      const currentState = { ...initialState };
      const newState = appReducer(currentState, { type: 'UNKNOWN_ACTION' });
      expect(newState).toBe(currentState);
    });
  });

  describe('authentication actions', () => {
    test('should handle LOGIN action', () => {
      const loginPayload = {
        email: 'test@example.com',
        password: 'password123'
      };

      const newState = appReducer(initialState, {
        type: APP_ACTIONS.LOGIN,
        payload: loginPayload
      });

      expect(newState.user).toEqual({
        email: loginPayload.email,
        password: loginPayload.password,
        isLoggedIn: true
      });

			expect(newState.displayDrawer).toBe(initialState.displayDrawer);
      expect(newState.notifications).toBe(initialState.notifications);
    });

    test('should handle LOGOUT action', () => {
      const loggedInState = {
        ...initialState,
        user: {
          email: 'test@example.com',
          password: 'password123',
          isLoggedIn: true
        },
        courses: [{ id: 1, name: 'React' }]
      };

      const newState = appReducer(loggedInState, { type: APP_ACTIONS.LOGOUT });

      // Verify complete logout state reset
      expect(newState.user).toEqual({
        email: '',
        password: '',
        isLoggedIn: false
      });
      expect(newState.courses).toEqual([]);
    });
  });

  describe('display/hide notifications list state action', () => {
    test('should handle TOGGLE_DRAWER action', () => {
      const initialDrawerState = initialState.displayDrawer;
      const newState = appReducer(initialState, { 
        type: APP_ACTIONS.TOGGLE_DRAWER 
      });

      expect(newState.displayDrawer).toBe(!initialDrawerState);
      expect(newState.user).toEqual(initialState.user);
    });
  });

  describe('notifications actions', () => {
    test('should handle SET_NOTIFICATIONS action', () => {
      const notifications = [
        { id: 1, message: 'Test notification' }
      ];

      const newState = appReducer(initialState, {
        type: APP_ACTIONS.SET_NOTIFICATIONS,
        payload: notifications
      });

      expect(newState.notifications).toEqual(notifications);
    });

    test('should handle MARK_NOTIFICATION_READ action', () => {
      const currentState = {
        ...initialState,
        notifications: [
          { id: 1, message: 'First notification' },
          { id: 2, message: 'Second notification' }
        ]
      };

      const newState = appReducer(currentState, {
        type: APP_ACTIONS.MARK_NOTIFICATION_READ,
        payload: 1
      });

      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0].id).toBe(2);
      // verify immutability
      expect(newState.notifications).not.toBe(currentState.notifications);
    });
  });

  describe('Course Management', () => {
    test('should handle SET_COURSES action', () => {
      const courses = [
        { id: 1, name: 'React Basics' },
        { id: 2, name: 'Advanced React' }
      ];

      const newState = appReducer(initialState, {
        type: APP_ACTIONS.SET_COURSES,
        payload: courses
      });

      expect(newState.courses).toEqual(courses);
    });

    test('should clear courses on logout', () => {
      const stateWithCourses = {
        ...initialState,
        courses: [{ id: 1, name: 'React' }]
      };

      const newState = appReducer(stateWithCourses, { 
        type: APP_ACTIONS.LOGOUT 
      });

      expect(newState.courses).toEqual([]);
    });
  });
});
