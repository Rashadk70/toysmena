const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'aed',
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update order status
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(paymentIntent) {
  try {
    const order = await Order.findOne({
      'paymentResult.id': paymentIntent.id,
    });

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email,
      };

      await order.save();
    }
  } catch (err) {
    console.error('Error updating order after successful payment:', err);
  }
}

async function handleFailedPayment(failedPayment) {
  try {
    const order = await Order.findOne({
      'paymentResult.id': failedPayment.id,
    });

    if (order) {
      order.paymentResult = {
        id: failedPayment.id,
        status: failedPayment.status,
        update_time: new Date().toISOString(),
      };

      await order.save();
    }
  } catch (err) {
    console.error('Error updating order after failed payment:', err);
  }
}

module.exports = router;
