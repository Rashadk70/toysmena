import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const categories = [
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
];

function ProductDialog({ open, handleClose, product, handleSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        image: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    handleSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            name="price"
            label="Price (AED)"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="brand"
            label="Brand"
            value={formData.brand}
            onChange={handleChange}
          />
          <TextField
            name="stock"
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <TextField
            name="image"
            label="Image URL"
            value={formData.image}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {product ? 'Update' : 'Add'} Product
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          fetchProducts();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const url = selectedProduct
        ? `/api/admin/products/${selectedProduct.id}`
        : '/api/admin/products';
      const method = selectedProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        fetchProducts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
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
            label="Search Products"
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
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: 50, height: 50, objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>AED {product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditProduct(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ProductDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        product={selectedProduct}
        handleSave={handleSaveProduct}
      />
    </Box>
  );
}

export default Products;
