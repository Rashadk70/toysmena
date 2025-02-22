import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  People as UserIcon,
  Inventory as ProductIcon,
  AttachMoney as RevenueIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardCard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    salesData: {
      labels: [],
      datasets: [],
    },
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats({
          totalOrders: data.totalOrders,
          totalUsers: data.totalUsers,
          totalProducts: data.totalProducts,
          totalRevenue: data.totalRevenue,
          recentOrders: data.recentOrders,
          salesData: {
            labels: data.salesData.labels,
            datasets: [
              {
                label: 'Sales',
                data: data.salesData.values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <IconButton onClick={fetchDashboardData}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<OrderIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UserIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<ProductIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Revenue"
            value={`AED ${stats.totalRevenue}`}
            icon={<RevenueIcon sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={stats.salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell align="right">
                        AED {order.amount}
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

export default Dashboard;
