import React from 'react';
import { Provider } from 'react-redux';
import store from '../../app/store';

const WithReduxProvider = (WrappedComponent) => {
  return (props) => (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );
};

export default WithReduxProvider;