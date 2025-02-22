import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function ImageUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  width = '100%',
  height = 200,
  showPreview = true,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.url);
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes.join(',')}
        style={{ display: 'none' }}
      />

      {showPreview && value ? (
        <Paper
          sx={{
            width,
            height,
            position: 'relative',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
            }}
            onClick={handleRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          sx={{
            width,
            height,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          onClick={handleClick}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">
                Click or drag image to upload
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max size: {maxSize / 1024 / 1024}MB
              </Typography>
            </>
          )}
        </Paper>
      )}

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {!showPreview && (
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      )}
    </Box>
  );
}

export default ImageUpload;
