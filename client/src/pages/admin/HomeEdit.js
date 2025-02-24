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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Delete,
  Add,
  Edit,
  DragIndicator,
  Image,
  Link as LinkIcon,
  Category,
  LocalOffer,
} from '@mui/icons-material';

const HomeEdit = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [banners, setBanners] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    active: true,
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    imageUrl: '',
    description: '',
    position: 0,
    active: true,
  });

  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    imageUrl: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    active: true,
  });

  const [newSection, setNewSection] = useState({
    title: '',
    type: 'products',
    layout: 'grid',
    items: [],
    backgroundColor: '#ffffff',
    textColor: '#000000',
    active: true,
  });

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home-content');
      const data = await response.json();
      setBanners(data.banners || []);
      setFeaturedCategories(data.featuredCategories || []);
      setPromotions(data.promotions || []);
      setCustomSections(data.customSections || []);
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSaveItem = async () => {
    try {
      let endpoint = '';
      let payload = {};

      switch (dialogType) {
        case 'banner':
          endpoint = '/api/admin/banners';
          payload = editingItem || newBanner;
          break;
        case 'category':
          endpoint = '/api/admin/featured-categories';
          payload = editingItem || newCategory;
          break;
        case 'promotion':
          endpoint = '/api/admin/promotions';
          payload = editingItem || newPromotion;
          break;
        case 'section':
          endpoint = '/api/admin/custom-sections';
          payload = editingItem || newSection;
          break;
      }

      const response = await fetch(endpoint, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchHomeContent();
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDeleteItem = async (type, id) => {
    try {
      const endpoint = `/api/admin/${type}/${id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchHomeContent();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderBannerSection = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Banner Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('banner')}
        >
          Add Banner
        </Button>
      </Box>
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={banner.active}
                      onChange={(e) => handleUpdateStatus('banner', banner._id, e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog('banner', banner)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem('banners', banner._id)}>
                  <Delete />
                </IconButton>
                <IconButton>
                  <DragIndicator />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderFeaturedCategories = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Featured Categories</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('category')}
        >
          Add Category
        </Button>
      </Box>
      <Grid container spacing={2}>
        {featuredCategories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category._id}>
            <Card>
              <CardMedia
                component="img"
                height="120"
                image={category.imageUrl}
                alt={category.name}
              />
              <CardContent>
                <Typography variant="h6">{category.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={category.active}
                      onChange={(e) => handleUpdateStatus('category', category._id, e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog('category', category)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem('categories', category._id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderPromotions = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Promotional Sections</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('promotion')}
        >
          Add Promotion
        </Button>
      </Box>
      <Grid container spacing={2}>
        {promotions.map((promo) => (
          <Grid item xs={12} sm={6} key={promo._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={promo.imageUrl}
                alt={promo.title}
              />
              <CardContent>
                <Typography variant="h6">{promo.title}</Typography>
                <Typography variant="body2">{promo.description}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${promo.discountValue}${promo.discountType === 'percentage' ? '%' : '$'} OFF`}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog('promotion', promo)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem('promotions', promo._id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderCustomSections = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Custom Sections</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('section')}
        >
          Add Section
        </Button>
      </Box>
      <Grid container spacing={2}>
        {customSections.map((section) => (
          <Grid item xs={12} key={section._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{section.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {section.type} | Layout: {section.layout}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${section.items.length} items`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Background: ${section.backgroundColor}`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog('section', section)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem('sections', section._id)}>
                  <Delete />
                </IconButton>
                <IconButton>
                  <DragIndicator />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Home Page
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Banners" icon={<Image />} iconPosition="start" />
          <Tab label="Featured Categories" icon={<Category />} iconPosition="start" />
          <Tab label="Promotions" icon={<LocalOffer />} iconPosition="start" />
          <Tab label="Custom Sections" icon={<LinkIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderBannerSection()}
      {activeTab === 1 && renderFeaturedCategories()}
      {activeTab === 2 && renderPromotions()}
      {activeTab === 3 && renderCustomSections()}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>
          {/* Dialog content will be different based on dialogType */}
          {/* Add your form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeEdit;
