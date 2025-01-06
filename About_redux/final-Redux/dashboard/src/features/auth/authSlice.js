import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: '',
    password: '',
  },
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user.email = '';
      state.user.password = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
