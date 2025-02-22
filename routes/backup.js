const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const backupService = require('../services/backupService');
const multer = require('multer');
const path = require('path');

// Configure multer for backup file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../backups/temp'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip') {
      cb(null, true);
    } else {
      cb(new Error('Only zip files are allowed'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 100 // 100MB max file size
  }
});

// Create a new backup
router.post('/', protect, admin, async (req, res) => {
  try {
    const { type = 'manual' } = req.body;
    const result = await backupService.createBackup(type);
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      data: result
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
});

// List all backups
router.get('/', protect, admin, async (req, res) => {
  try {
    const { type } = req.query;
    const backups = await backupService.listBackups(type);
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list backups',
      error: error.message
    });
  }
});

// Download a backup
router.get('/:filename', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../backups', filename);
    
    res.download(filePath, filename, (error) => {
      if (error) {
        console.error('Download backup error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to download backup',
          error: error.message
        });
      }
    });
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download backup',
      error: error.message
    });
  }
});

// Restore from a backup
router.post('/restore', protect, admin, upload.single('backup'), async (req, res) => {
  try {
    let backupSource;
    
    if (req.file) {
      // Restore from uploaded file
      backupSource = req.file.path;
    } else if (req.body.s3Key) {
      // Restore from S3
      backupSource = `s3://${req.body.s3Key}`;
    } else {
      throw new Error('No backup source provided');
    }

    await backupService.restoreBackup(backupSource);
    
    res.json({
      success: true,
      message: 'Backup restored successfully'
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore backup',
      error: error.message
    });
  }
});

// Delete a backup
router.delete('/:filename', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    await backupService.deleteBackup(filename);
    
    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete backup',
      error: error.message
    });
  }
});

module.exports = router;
