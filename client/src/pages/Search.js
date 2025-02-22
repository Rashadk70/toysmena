import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import ProductCard from '../components/products/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../store/slices/productSlice';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const query = useQuery();
  const searchQuery = query.get('q');
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchProducts(searchQuery));
    }
  }, [dispatch, searchQuery]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search Results for "{searchQuery}"
      </Typography>
      {products.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No products found matching your search.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
