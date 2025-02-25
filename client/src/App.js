import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Box, Alert, Backdrop, Container, Typography } from '@mui/material';
import theme from './theme';
import store from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import HomeEdit from './pages/admin/HomeEdit';
import ProductList from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            py: 4
          }}>
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: theme.palette.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Backdrop
    open={true}
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    }}
  >
    <CircularProgress color="primary" />
  </Backdrop>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

function AppContent() {
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error);
      setError(event.error?.message || 'An unexpected error occurred');
      setTimeout(() => setError(null), 5000);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (authLoading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            top: 20, 
            right: 20, 
            zIndex: 9999,
            maxWidth: '80%',
            '@media (min-width: 600px)': {
              maxWidth: 400,
            },
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="home-edit" element={<HomeEdit />} />
          </Route>

          {/* Category Routes */}
          <Route path="/category/:category/:subcategory" element={<ProductList />} />
          <Route path="/sellers" element={<ProductList />} />
          <Route path="/clerkery-books" element={<ProductList />} />
          <Route path="/dryad-big-book" element={<ProductList />} />
          <Route path="/dryad-education" element={<ProductList />} />
          <Route path="/findel-education" element={<ProductList />} />
          <Route path="/normans-music" element={<ProductList />} />
          <Route path="/specialist-crafts" element={<ProductList />} />
          <Route path="/samaritan" element={<ProductList />} />
          <Route path="/wildgoose" element={<ProductList />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
