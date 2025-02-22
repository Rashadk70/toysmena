import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Rating,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Store as StoreIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import ImageUpload from '../components/common/ImageUpload';

function SellerDialog({ open, handleClose, seller, handleSave }) {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: '',
    category: '',
    isVerified: false,
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (seller) {
      setFormData({
        storeName: seller.storeName,
        ownerName: seller.ownerName,
        email: seller.email,
        phone: seller.phone,
        address: seller.address,
        description: seller.description,
        logo: seller.logo,
        category: seller.category,
        isVerified: seller.isVerified,
        isActive: seller.isActive,
      });
    } else {
      setFormData({
        storeName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        logo: '',
        category: '',
        isVerified: false,
        isActive: true,
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.storeName || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    handleSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {seller ? 'Edit Seller' : 'Add New Seller'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <ImageUpload
              value={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              height={150}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="storeName"
              label="Store Name"
              value={formData.storeName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="ownerName"
              label="Owner Name"
              value={formData.ownerName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="toys">Toys</MenuItem>
                <MenuItem value="educational">Educational</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="stationery">Stationery</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Verification</InputLabel>
              <Select
                name="isVerified"
                value={formData.isVerified}
                onChange={handleChange}
                label="Verification"
              >
                <MenuItem value={true}>Verified</MenuItem>
                <MenuItem value={false}>Not Verified</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {seller ? 'Update' : 'Add'} Seller
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SellerDetailsDialog({ open, handleClose, seller }) {
  if (!seller) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Seller Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            {seller.logo && (
              <img
                src={seller.logo}
                alt={seller.storeName}
                style={{ maxHeight: 150, objectFit: 'contain' }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {seller.storeName}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {seller.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Typography>Owner: {seller.ownerName}</Typography>
            <Typography>Email: {seller.email}</Typography>
            <Typography>Phone: {seller.phone}</Typography>
            <Typography>Address: {seller.address}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Store Statistics
            </Typography>
            <Typography>Total Products: {seller.totalProducts}</Typography>
            <Typography>Total Orders: {seller.totalOrders}</Typography>
            <Typography>
              Average Rating:{' '}
              <Rating value={seller.rating} readOnly precision={0.5} />
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sellers');
      const data = await response.json();

      if (data.success) {
        setSellers(data.sellers);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddSeller = () => {
    setSelectedSeller(null);
    setDialogOpen(true);
  };

  const handleEditSeller = (seller) => {
    setSelectedSeller(seller);
    setDialogOpen(true);
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setDetailsDialogOpen(true);
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      try {
        const response = await fetch(`/api/admin/sellers/${sellerId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          fetchSellers();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete seller');
      }
    }
  };

  const handleToggleSellerStatus = async (sellerId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();

      if (data.success) {
        fetchSellers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update seller status');
    }
  };

  const handleSaveSeller = async (sellerData) => {
    try {
      const url = selectedSeller
        ? `/api/admin/sellers/${selectedSeller.id}`
        : '/api/admin/sellers';
      const method = selectedSeller ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
      });

      const data = await response.json();

      if (data.success) {
        fetchSellers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save seller');
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || seller.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sellers</Typography>
        <Button
          variant="contained"
          startIcon={<StoreIcon />}
          onClick={handleAddSeller}
        >
          Add Seller
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search Sellers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="toys">Toys</MenuItem>
              <MenuItem value="educational">Educational</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="stationery">Stationery</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Store</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Verification</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSellers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {seller.logo ? (
                        <img
                          src={seller.logo}
                          alt={seller.storeName}
                          style={{ width: 40, height: 40, objectFit: 'contain' }}
                        />
                      ) : (
                        <StoreIcon />
                      )}
                      <Typography>{seller.storeName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{seller.ownerName}</TableCell>
                  <TableCell>
                    <Chip label={seller.category} />
                  </TableCell>
                  <TableCell>
                    <Rating value={seller.rating} readOnly precision={0.5} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={seller.isActive ? 'Active' : 'Inactive'}
                      color={seller.isActive ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={seller.isVerified ? 'Verified' : 'Not Verified'}
                      color={seller.isVerified ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="info"
                      onClick={() => handleViewDetails(seller)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditSeller(seller)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color={seller.isActive ? 'error' : 'success'}
                      onClick={() =>
                        handleToggleSellerStatus(seller.id, seller.isActive)
                      }
                    >
                      <BlockIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSeller(seller.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSellers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <SellerDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        seller={selectedSeller}
        handleSave={handleSaveSeller}
      />

      <SellerDetailsDialog
        open={detailsDialogOpen}
        handleClose={() => setDetailsDialogOpen(false)}
        seller={selectedSeller}
      />
    </Box>
  );
}

export default Sellers;
