import coursesSlice, { fetchCourses } from '../courses/coursesSlice';
import { logout } from '../auth/authSlice';

describe('coursesSlice', () => {
  const initialState = {
    courses: [],
  };

  test('should return the initial state', () => {
    expect(coursesSlice(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchCourses async thunk', () => {
    test('should handle fetchCourses.pending', () => {
      const action = { type: fetchCourses.pending.type };
      const state = coursesSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });

    test('should handle fetchCourses.rejected', () => {
      const action = {
        type: fetchCourses.rejected.type,
      };
      const state = coursesSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });

    test('should handle fetchCourses.fulfilled', () => {
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ];
      const action = {
        type: fetchCourses.fulfilled.type,
        payload: mockCourses,
      };
      const state = coursesSlice(initialState, action);
      expect(state).toEqual({
        courses: mockCourses,
      });
    });
  });

  describe('logout action', () => {
    test('should reset courses array on logout', () => {
      const stateWithCourses = {
        courses: [
          { id: 1, title: 'Introduction to Programming' },
          { id: 2, title: 'Advanced Mathematics' },
        ],
      };

      const action = { type: logout.type };
      const state = coursesSlice(stateWithCourses, action);

      expect(state).toEqual({
        courses: [],
      });
    });
  });
});
