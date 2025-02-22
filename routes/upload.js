const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Handle single image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filepath = path.join(uploadDir, filename);

    // Process image with sharp
    await sharp(req.file.buffer)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toFile(filepath);

    // Return the URL
    res.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
    });
  }
});

// Delete uploaded image
router.delete('/:filename', protect, (req, res) => {
  try {
    const filepath = path.join(uploadDir, req.params.filename);
    
    // Check if file exists
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
    });
  }
});

module.exports = router;
