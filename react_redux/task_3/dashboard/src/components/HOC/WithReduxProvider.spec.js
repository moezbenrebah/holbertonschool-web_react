// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { createSlice, configureStore } from '@reduxjs/toolkit';
// import WithReduxProvider from './WithReduxProvider';
// import { useDispatch, useSelector } from 'react-redux';

// // Create mock slice
// const mockSlice = createSlice({
//   name: 'mock',
//   initialState: { test: 'initial' },
//   reducers: {
//     updateTest: (state, action) => {
//       state.test = action.payload;
//     },
//   },
// });

// const mockReducer = mockSlice.reducer;
// const { updateTest } = mockSlice.actions;

// // Create mock store
// const mockStore = configureStore({
//   reducer: {
//     mock: mockReducer,
//   },
// });

// // Mock component using Redux hooks
// const MockComponent = () => {
//   const dispatch = useDispatch();
//   const testValue = useSelector(state => state.mock.test);

//   React.useEffect(() => {
//     dispatch(updateTest('updated'));
//   }, [dispatch]);

//   return <div data-testid="mock-component">{testValue}</div>;
// };

// // Create HOC with mock store
// const withReduxProviderHOC = WithReduxProvider(mockStore);
// const HOCWrappedComponent = withReduxProviderHOC(MockComponent);

// describe('withReduxProvider HOC', () => {
//   it('renders the wrapped component', () => {
//     render(<HOCWrappedComponent />);
//     expect(screen.getByTestId('mock-component')).toHaveTextContent('updated');
//   });

//   it('passes down props to the wrapped component', () => {
//     const propsToPass = { customProp: 'customValue' };
//     const MockComponentWithProps = (props) => {
//       return <div data-testid="mock-component-props">{props.customProp}</div>;
//     };
//     const HOCWrappedComponentWithProps = withReduxProviderHOC(MockComponentWithProps);
//     render(<HOCWrappedComponentWithProps {...propsToPass} />);
//     expect(screen.getByTestId('mock-component-props')).toHaveTextContent(propsToPass.customProp);
//   });
// });


import React from 'react';
import { render, screen } from '@testing-library/react';
import WithReduxProvider from './WithReduxProvider';
import MockComponent from './MockComponent';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, configureStore } from '@reduxjs/toolkit';

function MockComponent() {
  const dispatch = useDispatch();
  const testValue = useSelector(state => state.mock.test);

  useEffect(() => {
    dispatch(updateTest('updated'));
  }, [dispatch]);

  return <div data-testid="mock-component">{testValue}</div>;
};

const mockSlice = createSlice({
  name: 'mock',
  initialState: { test: 'initial' },
  reducers: {
    updateTest: (state, action) => {
      state.test = action.payload;
    },
  },
});

const mockReducer = mockSlice.reducer;
const mockStore = configureStore({
  reducer: {
    mock: mockReducer,
  },
});

// Create HOC with mock store
const HOCWrappedComponent = WithReduxProvider(mockStore)(MockComponent);

describe('withReduxProvider HOC', () => {
  it('renders the wrapped component', () => {
    render(<HOCWrappedComponent />);
    expect(screen.getByTestId('mock-component')).toHaveTextContent('updated');
  });

  it('passes down props to the wrapped component', () => {
    const propsToPass = { customProp: 'customValue' };
    const MockComponentWithProps = (props) => {
      return <div data-testid="mock-component-props">{props.customProp}</div>;
    };
    const HOCWrappedComponentWithProps = WithReduxProvider(mockStore)(MockComponentWithProps);
    render(<HOCWrappedComponentWithProps {...propsToPass} />);
    expect(screen.getByTestId('mock-component-props')).toHaveTextContent(propsToPass.customProp);
  });
});