import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminSettings from './pages/Admin/Settings';
import AdminHomeEdit from './pages/Admin/HomeEdit';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="home-edit" element={<AdminHomeEdit />} />
              </Route>

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
      </Router>
    </ThemeProvider>
  );
}

export default App;
