import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import wishlistReducer from './slices/wishlistSlice';
import userReducer from './slices/userSlice';

// Create a custom middleware to handle errors
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an error in Redux:', err);
    return next({
      type: 'ERROR',
      error: err.message || 'An unexpected error occurred',
    });
  }
};

// Load persisted state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      cart: state.cart,
      wishlist: state.wishlist,
    });
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    user: userReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes to save state
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
