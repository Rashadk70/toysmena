import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { fetchProducts, setCurrentPage } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const categories = [
  'Early Years',
  'Curricular',
  'Art & Design',
  'Stationery & Office',
  'Furniture',
  'Exercise Books',
  'Sport',
  'Science',
  'SEN',
  'Facilities',
  'IT & Hardware',
];

function Products() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');
  const { items, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.products
  );
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory, page: currentPage }));
  }, [dispatch, selectedCategory, currentPage]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePageChange = (event, value) => {
    dispatch(setCurrentPage(value));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleWishlistToggle = (productId) => {
    const isInWishlist = wishlistItems.some((item) => item.id === productId);
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {items.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  AED {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product)}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <IconButton
                  onClick={() => handleWishlistToggle(product.id)}
                  color="primary"
                >
                  {wishlistItems.some((item) => item.id === product.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}

export default Products;
