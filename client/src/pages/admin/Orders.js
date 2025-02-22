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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const orderStatuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

function OrderDetailsDialog({ open, handleClose, order, handleStatusUpdate }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSubmit = () => {
    handleStatusUpdate(order.id, status);
    handleClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details - #{order.id}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Typography>Name: {order.customer.name}</Typography>
          <Typography>Email: {order.customer.email}</Typography>
          <Typography>Phone: {order.customer.phone}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Address
          </Typography>
          <Typography>{order.shippingAddress.address}</Typography>
          <Typography>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zipCode}
          </Typography>
          <Typography>{order.shippingAddress.country}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">AED {item.price}</TableCell>
                    <TableCell align="right">
                      AED {item.price * item.quantity}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>AED {order.total}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search Orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
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
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>AED {order.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <OrderDetailsDialog
        open={Boolean(selectedOrder)}
        handleClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        handleStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
}

export default Orders;
