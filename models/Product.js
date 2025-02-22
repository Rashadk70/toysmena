const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  specifications: {
    type: Map,
    of: String,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  avgRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update average rating when a review is added
productSchema.methods.updateAvgRating = function() {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
    this.numReviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.avgRating = totalRating / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
