import authReducer, { login, logout } from "/home/moez/Documents/React_New_Version/vite_react/ForLocalTest/holbertonschool-web_react/react_redux/task_1/dashboard/faulty-authSlice-seq1.js";

describe('authSlice', () => {
  const initialState = {
    user: {
      email: '',
      password: '',
    },
    isLoggedIn: false,
  };

  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle login', () => {
    const user = { email: 'test@example.com', password: 'password123' };
    const action = login(user);
    const expectedState = {
      user,
      isLoggedIn: true,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test('should handle logout', () => {
    const loggedInState = {
      user: { email: 'test@example.com', password: 'password123' },
      isLoggedIn: true,
    };
    const action = logout();
    expect(authReducer(loggedInState, action)).toEqual(initialState);
  });
});
