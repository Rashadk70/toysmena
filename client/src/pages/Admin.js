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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100', pt: 3, pb: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} lg={2}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                position: 'sticky',
                top: '1rem',
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto'
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
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: location.pathname === item.link ? 'primary.main' : 'inherit'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: location.pathname === item.link ? 600 : 500,
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
                minHeight: 'calc(100vh - 2rem)',
              }}
            >
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Admin;
