const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  link: String,
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const featuredCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  position: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const customSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['products', 'categories', 'brands', 'custom'],
    default: 'products',
  },
  layout: {
    type: String,
    enum: ['grid', 'slider', 'list'],
    default: 'grid',
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',
  }],
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Banner = mongoose.model('Banner', bannerSchema);
const FeaturedCategory = mongoose.model('FeaturedCategory', featuredCategorySchema);
const Promotion = mongoose.model('Promotion', promotionSchema);
const CustomSection = mongoose.model('CustomSection', customSectionSchema);

module.exports = {
  Banner,
  FeaturedCategory,
  Promotion,
  CustomSection,
};
