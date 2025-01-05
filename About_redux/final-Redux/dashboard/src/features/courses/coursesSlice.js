import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5173';
const ENDPOINTS = {
  courses: `${API_BASE_URL}/courses.json`,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await axios.get(ENDPOINTS.courses);
    console.log('Courses=====>', response.data.courses)
    return response.data.courses;
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
  },
});

export default coursesSlice.reducer;