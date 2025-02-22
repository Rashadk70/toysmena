import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, error } = useSelector((state) => state.cart);
  const [shippingCost] = useState(15); // Default shipping cost in AED

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    dispatch(updateCartItem({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, objectFit: 'contain' }}
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.category}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        AED {item.price}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.quantity}
                      InputProps={{
                        readOnly: true,
                        sx: { width: 60, textAlign: 'center' },
                      }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal</Typography>
                  <Typography>AED {total}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Shipping</Typography>
                  <Typography>AED {shippingCost}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    AED {total + shippingCost}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;
