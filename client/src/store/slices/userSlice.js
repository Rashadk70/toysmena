import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        profileData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/password',
        passwordData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update password'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = userSlice.actions;
export default userSlice.reducer;
