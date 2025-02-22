import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import wishlistReducer from './slices/wishlistSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    user: userReducer,
  },
});

export default store;
