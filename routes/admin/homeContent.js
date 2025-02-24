const express = require('express');
const router = express.Router();
const { Banner, FeaturedCategory, Promotion, CustomSection } = require('../../models/HomeContent');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Get all home content
router.get('/home-content', auth, async (req, res) => {
  try {
    const banners = await Banner.find().sort('position');
    const featuredCategories = await FeaturedCategory.find().sort('position');
    const promotions = await Promotion.find().sort('-startDate');
    const customSections = await CustomSection.find().sort('position');

    res.json({
      banners,
      featuredCategories,
      promotions,
      customSections,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Banner routes
router.post('/banners', auth, admin, async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/banners/:id', auth, admin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/banners/:id', auth, admin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Featured Category routes
router.post('/featured-categories', auth, admin, async (req, res) => {
  try {
    const category = new FeaturedCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/featured-categories/:id', auth, admin, async (req, res) => {
  try {
    const category = await FeaturedCategory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/featured-categories/:id', auth, admin, async (req, res) => {
  try {
    const category = await FeaturedCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Promotion routes
router.post('/promotions', auth, admin, async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/promotions/:id', auth, admin, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/promotions/:id', auth, admin, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Custom Section routes
router.post('/custom-sections', auth, admin, async (req, res) => {
  try {
    const section = new CustomSection(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/custom-sections/:id', auth, admin, async (req, res) => {
  try {
    const section = await CustomSection.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/custom-sections/:id', auth, admin, async (req, res) => {
  try {
    const section = await CustomSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
