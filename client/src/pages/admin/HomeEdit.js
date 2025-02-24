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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const response = await fetch('/api/admin/home-content');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch home content');
      }

      setBanners(data.banners || []);
      setFeaturedCategories(data.featuredCategories || []);
      setPromotions(data.promotions || []);
      setCustomSections(data.customSections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (type, id, status) => {
    try {
      const response = await fetch(`/api/admin/home-content/${type}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update local state based on type
      switch (type) {
        case 'banner':
          setBanners(banners.map(b => b._id === id ? { ...b, active: status } : b));
          break;
        case 'category':
          setFeaturedCategories(cats => cats.map(c => c._id === id ? { ...c, active: status } : c));
          break;
        case 'promotion':
          setPromotions(promos => promos.map(p => p._id === id ? { ...p, active: status } : p));
          break;
        case 'custom':
          setCustomSections(sections => sections.map(s => s._id === id ? { ...s, active: status } : s));
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setDialogType('');
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/home-content/${type}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete item');
      }

      // Update local state based on type
      switch (type) {
        case 'banners':
          setBanners(banners.filter(b => b._id !== id));
          break;
        case 'categories':
          setFeaturedCategories(cats => cats.filter(c => c._id !== id));
          break;
        case 'promotions':
          setPromotions(promos => promos.filter(p => p._id !== id));
          break;
        case 'custom-sections':
          setCustomSections(sections => sections.filter(s => s._id !== id));
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveItem = async (formData) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `/api/admin/home-content/${dialogType}/${editingItem._id}`
        : `/api/admin/home-content/${dialogType}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save item');
      }

      // Update local state based on type
      switch (dialogType) {
        case 'banner':
          if (editingItem) {
            setBanners(banners.map(b => b._id === editingItem._id ? data : b));
          } else {
            setBanners([...banners, data]);
          }
          break;
        case 'category':
          if (editingItem) {
            setFeaturedCategories(cats => cats.map(c => c._id === editingItem._id ? data : c));
          } else {
            setFeaturedCategories(prev => [...prev, data]);
          }
          break;
        case 'promotion':
          if (editingItem) {
            setPromotions(promos => promos.map(p => p._id === editingItem._id ? data : p));
          } else {
            setPromotions(prev => [...prev, data]);
          }
          break;
        case 'custom':
          if (editingItem) {
            setCustomSections(sections => sections.map(s => s._id === editingItem._id ? data : s));
          } else {
            setCustomSections(prev => [...prev, data]);
          }
          break;
        default:
          break;
      }

      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderBanners = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Banners</Typography>
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
          <Grid item xs={12} sm={6} md={4} key={promo._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={promo.imageUrl}
                alt={promo.title}
              />
              <CardContent>
                <Typography variant="h6">{promo.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {promo.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`Valid until: ${new Date(promo.validUntil).toLocaleDateString()}`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={promo.active}
                        onChange={(e) => handleUpdateStatus('promotion', promo._id, e.target.checked)}
                      />
                    }
                    label="Active"
                  />
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
          onClick={() => handleOpenDialog('custom')}
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
                  {section.content}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={section.active}
                      onChange={(e) => handleUpdateStatus('custom', section._id, e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog('custom', section)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem('custom-sections', section._id)}>
                  <Delete />
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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Banners" />
        <Tab label="Featured Categories" />
        <Tab label="Promotions" />
        <Tab label="Custom Sections" />
      </Tabs>

      {activeTab === 0 && renderBanners()}
      {activeTab === 1 && renderFeaturedCategories()}
      {activeTab === 2 && renderPromotions()}
      {activeTab === 3 && renderCustomSections()}
    </Container>
  );
};

export default HomeEdit;
