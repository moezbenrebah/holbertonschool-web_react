import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: {
    name: 'Holberton Dashboard', // Custom name in DevTools
    trace: true,    // Enable action stack traces
    traceLimit: 25  // Limit stack trace depth
  }
});

export default store;
