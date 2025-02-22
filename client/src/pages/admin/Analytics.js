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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
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
} from '@mui/icons-material';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function AnalyticsCard({ title, value, percentage, trend, children }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography
            variant="body2"
            color={trend === 'up' ? 'success.main' : 'error.main'}
          >
            {percentage}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            vs last period
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({
    summary: {
      revenue: 0,
      orders: 0,
      customers: 0,
      avgOrderValue: 0,
    },
    salesTrend: [],
    topProducts: [],
    categoryDistribution: [],
    customerSegments: [],
    revenueByLocation: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
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
      const response = await fetch(`/api/admin/analytics/export?timeRange=${timeRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}.xlsx`;
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
        <Typography variant="h4">Analytics</Typography>
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
          <AnalyticsCard
            title="Total Revenue"
            value={`AED ${data.summary.revenue.toLocaleString()}`}
            percentage={12.5}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Orders"
            value={data.summary.orders.toLocaleString()}
            percentage={8.3}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="New Customers"
            value={data.summary.customers.toLocaleString()}
            percentage={-2.4}
            trend="down"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Average Order Value"
            value={`AED ${data.summary.avgOrderValue.toLocaleString()}`}
            percentage={5.7}
            trend="up"
          />
        </Grid>
      </Grid>

      {/* Sales Trend Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sales Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Revenue"
            />
            <Line
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
              Top Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Revenue</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.categoryDistribution.map((entry, index) => (
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

        {/* Customer Segments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Customer Segments
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.customerSegments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue by Location */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Location
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.revenueByLocation.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell align="right">{location.orders}</TableCell>
                      <TableCell align="right">
                        AED {location.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics;
