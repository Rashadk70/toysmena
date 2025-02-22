import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import {
  fetchWishlist,
  removeFromWishlist,
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
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
            Your wishlist is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/products"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  bgcolor: 'background.paper',
                }}
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                <DeleteIcon />
              </IconButton>

              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  objectFit: 'contain',
                  p: 2,
                }}
                image={item.image}
                alt={item.name}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {item.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  AED {item.price}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<CartIcon />}
                  onClick={() => handleAddToCart(item)}
                  fullWidth
                >
                  Move to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Wishlist;
