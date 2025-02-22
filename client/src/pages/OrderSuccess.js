import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/material';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your order has been placed successfully
        </Typography>
        {orderId && (
          <Typography variant="body1" color="text.secondary" paragraph>
            Order ID: {orderId}
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary" paragraph>
          We'll send you an email confirmation with order details and tracking
          information.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/account/orders')}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderSuccess;
