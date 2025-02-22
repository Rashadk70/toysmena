const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search = '' } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Create product (Seller/Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Update product (Seller/Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Make sure user is product seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Delete product (Seller/Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Make sure user is product seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await product.remove();

    res.json({
      success: true,
      message: 'Product removed',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed',
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.updateAvgRating();
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
