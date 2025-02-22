import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, link: '/admin' },
  { text: 'Users', icon: <People />, link: '/admin/users' },
  { text: 'Products', icon: <Inventory />, link: '/admin/products' },
  { text: 'Orders', icon: <ShoppingCart />, link: '/admin/orders' },
  { text: 'Analytics', icon: <Assessment />, link: '/admin/analytics' },
  { text: 'Settings', icon: <Settings />, link: '/admin/settings' },
];

const AdminDashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2}>
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <List component="nav">
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.link}
                  button
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9} lg={10}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              minHeight: '70vh',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome to Admin Dashboard
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              {/* Quick stats */}
              {[
                { title: 'Total Users', value: '1,234' },
                { title: 'Total Products', value: '567' },
                { title: 'Total Orders', value: '89' },
                { title: 'Revenue', value: '$12,345' },
              ].map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography color="textSecondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 500 }}>
                      {stat.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
