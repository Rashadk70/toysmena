import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  Home,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, link: '/admin' },
  { text: 'Users', icon: <People />, link: '/admin/users' },
  { text: 'Products', icon: <Inventory />, link: '/admin/products' },
  { text: 'Orders', icon: <ShoppingCart />, link: '/admin/orders' },
  { text: 'Analytics', icon: <Assessment />, link: '/admin/analytics' },
  { text: 'Home Page', icon: <Home />, link: '/admin/home-edit' },
  { text: 'Settings', icon: <Settings />, link: '/admin/settings' },
];

const Admin = () => {
  const location = useLocation();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'grey.200',
              position: { md: 'fixed' },
              width: { md: '16.67%' },
              maxWidth: { lg: '240px' }
            }}
          >
            <List component="nav">
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.link}
                  selected={location.pathname === item.link}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.link ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.link ? 600 : 500,
                      color: location.pathname === item.link ? 'primary.main' : 'inherit',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9} lg={10} sx={{ pl: { md: '18.67%', lg: '260px' } }}>
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
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Admin;
