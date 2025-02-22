import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
} from '@mui/icons-material';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value) || 1));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...selectedProduct, quantity }));
  };

  const handleWishlistToggle = () => {
    const isInWishlist = wishlistItems.some((item) => item.id === id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !selectedProduct) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">
          {error || 'Product not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">
          {selectedProduct.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <Box
              component="img"
              src={selectedProduct.image}
              alt={selectedProduct.name}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {selectedProduct.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            AED {selectedProduct.price}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {selectedProduct.description}
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ my: 3 }}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ width: 100, mr: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              size="large"
            >
              Add to Cart
            </Button>
            <IconButton
              onClick={handleWishlistToggle}
              color="primary"
              sx={{ ml: 1 }}
            >
              {wishlistItems.some((item) => item.id === id) ? (
                <Favorite />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <IconButton color="primary">
              <Share />
            </IconButton>
          </Box>

          {/* Additional Info Tabs */}
          <Box sx={{ mt: 4 }}>
            <Paper>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Specifications" />
                <Tab label="Shipping" />
                <Tab label="Reviews" />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1">
                  {selectedProduct.specifications}
                </Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Typography variant="body1">
                  Free shipping on orders over AED 500
                </Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1">
                  No reviews yet
                </Typography>
              </TabPanel>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail;
