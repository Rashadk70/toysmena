import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await axios.get('/api/cart');
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productData) => {
    const response = await axios.post('/api/cart', productData);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }) => {
    const response = await axios.put(`/api/cart/${productId}`, { quantity });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId) => {
    await axios.delete(`/api/cart/${productId}`);
    return productId;
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    updateTotal: (state) => {
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.total += action.payload.price * action.payload.quantity;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
          state.total = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
  },
});

export const { clearCart, updateTotal } = cartSlice.actions;
export default cartSlice.reducer;
