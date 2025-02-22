import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function MetricCard({ title, value, subValue, trend, icon: Icon }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trend > 0 ? (
            <TrendingUp color="success" fontSize="small" />
          ) : (
            <TrendingDown color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : 'error.main'}
            sx={{ mx: 1 }}
          >
            {Math.abs(trend)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subValue}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function SellerAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({
    summary: {
      revenue: 0,
      orders: 0,
      products: 0,
      conversion: 0,
    },
    revenueChart: [],
    topProducts: [],
    inventoryStatus: [],
    customerRetention: [],
    orderStatus: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/analytics?timeRange=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTimeRangeClose = (range) => {
    if (range) {
      setTimeRange(range);
    }
    setAnchorEl(null);
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/seller/analytics/export?timeRange=${timeRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `store-analytics-${timeRange}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Store Analytics</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={handleTimeRangeClick}
            sx={{ mr: 1 }}
          >
            {timeRange === '7d'
              ? 'Last 7 Days'
              : timeRange === '30d'
              ? 'Last 30 Days'
              : timeRange === '90d'
              ? 'Last 90 Days'
              : 'Custom'}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleTimeRangeClose()}
          >
            <MenuItem onClick={() => handleTimeRangeClose('7d')}>
              Last 7 Days
            </MenuItem>
            <MenuItem onClick={() => handleTimeRangeClose('30d')}>
              Last 30 Days
            </MenuItem>
            <MenuItem onClick={() => handleTimeRangeClose('90d')}>
              Last 90 Days
            </MenuItem>
          </Menu>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalyticsData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`AED ${data.summary.revenue.toLocaleString()}`}
            subValue="vs last period"
            trend={8.5}
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={data.summary.orders.toLocaleString()}
            subValue="vs last period"
            trend={12.3}
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Products"
            value={data.summary.products.toLocaleString()}
            subValue="vs last period"
            trend={-2.1}
            icon={TrendingDown}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${data.summary.conversion.toFixed(2)}%`}
            subValue="vs last period"
            trend={5.7}
            icon={TrendingUp}
          />
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Revenue & Orders Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#82ca9d"
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3}>
        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Growth</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.sales}</TableCell>
                      <TableCell align="right">
                        AED {product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={`${product.growth}%`}
                          color={product.growth >= 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Inventory Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.inventoryStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.inventoryStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Customer Retention */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Customer Retention
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.customerRetention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" stackId="a" fill="#8884d8" name="New Customers" />
                <Bar dataKey="returning" stackId="a" fill="#82ca9d" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Order Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.orderStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SellerAnalytics;
