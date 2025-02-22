import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

function CheckoutForm({ handleNext, handleBack, activeStep }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    if (paymentMethod === 'credit_card') {
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      try {
        // Create order with payment
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            shippingAddress: shippingData,
            paymentMethod: 'credit_card',
            paymentMethodId: stripePaymentMethod.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Clear cart and redirect to success page
          dispatch(clearCart());
          navigate('/order-success', { state: { orderId: data.order._id } });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while processing your payment.');
      }
    } else {
      // Handle COD
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            shippingAddress: shippingData,
            paymentMethod: 'cod',
          }),
        });

        const data = await response.json();

        if (data.success) {
          dispatch(clearCart());
          navigate('/order-success', { state: { orderId: data.order._id } });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while creating your order.');
      }
    }

    setProcessing(false);
  };

  const handleShippingChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleShippingSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={shippingData.firstName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={shippingData.lastName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="address"
                  label="Address"
                  fullWidth
                  value={shippingData.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="city"
                  label="City"
                  fullWidth
                  value={shippingData.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="state"
                  label="State/Province"
                  fullWidth
                  value={shippingData.state}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="zipCode"
                  label="Zip/Postal Code"
                  fullWidth
                  value={shippingData.zipCode}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="country"
                  label="Country"
                  fullWidth
                  value={shippingData.country}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  value={shippingData.phone}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </Box>
          </form>
        );

      case 1:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label="Credit/Debit Card"
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'credit_card' && (
              <Box sx={{ mt: 3 }}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {items.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography>AED {item.price * item.quantity}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6">AED {total}</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {shippingData.firstName} {shippingData.lastName}
              </Typography>
              <Typography>{shippingData.address}</Typography>
              <Typography>
                {shippingData.city}, {shippingData.state} {shippingData.zipCode}
              </Typography>
              <Typography>{shippingData.country}</Typography>
              <Typography>{shippingData.phone}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePaymentSubmit}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Place Order'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      {getStepContent(activeStep)}
    </Box>
  );
}

function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            handleNext={handleNext}
            handleBack={handleBack}
            activeStep={activeStep}
          />
        </Elements>
      </Paper>
    </Container>
  );
}

export default Checkout;
