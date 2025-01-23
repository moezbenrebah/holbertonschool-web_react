import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CourseList from './CourseList';
import coursesSlice from '../../features/courses/coursesSlice';
import { login } from '../../features/auth/authSlice';


describe('CourseList', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        courses: coursesSlice,
      },
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <CourseList />
      </Provider>
    );
    expect(screen.getByText('No course available yet')).toBeInTheDocument();
  });

  test('displays the list of courses', () => {
    store = configureStore({
      reducer: {
        courses: coursesSlice,
      },
      preloadedState: {
        courses: {
          courses: [
            { "id": 1, "name": "ES6", "credit": 60 },
            { "id": 2, "name": "Webpack", "credit": 20 },
            { "id": 3, "name": "React", "credit": 40 }
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <CourseList />
      </Provider>
    );

    expect(screen.getByText('ES6')).toBeInTheDocument();
    expect(screen.getByText('Webpack')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('selects and unselects a course when the checkbox is clicked', () => {
    store = configureStore({
      reducer: {
        courses: coursesSlice,
      },
      preloadedState: {
        courses: {
          courses: [
            { id: 1, name: 'ES6', credit: 60, isSelected: false },
            { id: 2, name: 'Webpack', credit: 20, isSelected: false },
            { id: 3, name: 'React', credit: 40, isSelected: false },
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <CourseList />
      </Provider>
    );

    // Find all checkboxes and select the first one (ES6)
    const checkboxes = screen.getAllByRole('checkbox');
    const checkbox = checkboxes[0];
    expect(checkbox).not.toBeChecked(); // Initially unchecked

    // Click the checkbox to select the course
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked(); // Should be checked after clicking

    // Verify the Redux state was updated
    const state = store.getState();
    expect(state.courses.courses[0].isSelected).toBe(true);

    // Click the checkbox again to unselect the course
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked(); // Should be unchecked after clicking again

    // Verify the Redux state was updated
    const updatedState = store.getState();
    expect(updatedState.courses.courses[0].isSelected).toBe(false);
  });
});