import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const response = await axios.get('/api/wishlist');
    return response.data;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId) => {
    const response = await axios.post('/api/wishlist', { productId });
    return response.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId) => {
    await axios.delete(`/api/wishlist/${productId}`);
    return productId;
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
