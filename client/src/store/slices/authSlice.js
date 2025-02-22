import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
