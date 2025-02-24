import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Navigation from './components/navigation/Navigation';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Category Routes */}
          <Route path="/category/:category/:subcategory" element={<Products />} />
          <Route path="/sellers" element={<Products />} />
          <Route path="/clerkery-books" element={<Products />} />
          <Route path="/dryad-big-book" element={<Products />} />
          <Route path="/dryad-education" element={<Products />} />
          <Route path="/findel-education" element={<Products />} />
          <Route path="/normans-music" element={<Products />} />
          <Route path="/specialist-crafts" element={<Products />} />
          <Route path="/samaritan" element={<Products />} />
          <Route path="/wildgoose" element={<Products />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
