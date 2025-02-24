import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import { Delete, Add, Edit } from '@mui/icons-material';

const HomeEdit = () => {
  const [banners, setBanners] = useState([]);
  const [sections, setSections] = useState([]);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
  });

  useEffect(() => {
    // Fetch existing banners and sections
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home-content');
      const data = await response.json();
      setBanners(data.banners || []);
      setSections(data.sections || []);
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newBanner),
      });

      if (response.ok) {
        fetchHomeContent();
        setNewBanner({ title: '', description: '', imageUrl: '', link: '' });
      }
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };

  const handleBannerDelete = async (bannerId) => {
    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchHomeContent();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Home Page
      </Typography>

      {/* Banner Management */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Banner Management
        </Typography>

        {/* Add New Banner Form */}
        <Box component="form" onSubmit={handleBannerSubmit} sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Banner Title"
                value={newBanner.title}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={newBanner.imageUrl}
                onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newBanner.description}
                onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link URL"
                value={newBanner.link}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
              >
                Add Banner
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Existing Banners */}
        <Typography variant="h6" gutterBottom>
          Current Banners
        </Typography>
        <Grid container spacing={2}>
          {banners.map((banner) => (
            <Grid item xs={12} sm={6} md={4} key={banner._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={banner.imageUrl}
                  alt={banner.title}
                />
                <CardContent>
                  <Typography variant="h6">{banner.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {banner.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleBannerDelete(banner._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Featured Sections Management */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Featured Sections
        </Typography>
        {/* Add section management here */}
      </Paper>
    </Container>
  );
};

export default HomeEdit;
